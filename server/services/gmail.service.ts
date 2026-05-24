// Tokens are persisted on the client (secure-store + gmail_tokens); the client passes
// the access token in the Authorization header on every Gmail-related request.
import { generateText, Output } from 'ai'
import { z } from 'zod'

import {
    fetchUserEmail,
    getHeader,
    getMessageMetadata,
    listMessageIds
} from '@/server/integrations/gmail/api'
import { exchangeAuthCode, refreshAccessToken } from '@/server/integrations/gmail/oauth'

const DEFAULT_MODEL = process.env.AI_GATEWAY_CHAT_MODEL ?? 'anthropic/claude-sonnet-4.5'

const callbackSchema = z.object({
    code: z.string().min(1),
    redirectUri: z.url(),
    codeVerifier: z.string().min(1)
})

export async function handleGmailCallback(request: Request): Promise<Response> {
    const body = await request.json()
    const parsed = callbackSchema.parse(body)

    const tokens = await exchangeAuthCode(parsed)
    const email = await fetchUserEmail(tokens.access_token)

    return Response.json({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiresIn: tokens.expires_in,
        email
    })
}

const refreshSchema = z.object({ refreshToken: z.string().min(1) })

export async function handleGmailRefresh(request: Request): Promise<Response> {
    const { refreshToken } = refreshSchema.parse(await request.json())
    const tokens = await refreshAccessToken(refreshToken)
    return Response.json({
        accessToken: tokens.access_token,
        expiresIn: tokens.expires_in
    })
}

export type TodoCandidate = {
    title: string
    notes?: string
    priority: 'low' | 'medium' | 'high'
    dueAt?: string
    source: 'gmail'
}

function bearerToken(request: Request): string {
    const header = request.headers.get('Authorization')
    if (!header?.toLowerCase().startsWith('bearer ')) {
        throw new Error('Missing or invalid Authorization header')
    }
    return header.slice('bearer '.length).trim()
}

const candidateSchema = z.object({
    candidates: z
        .array(
            z.object({
                title: z.string().min(1),
                notes: z.string().optional(),
                priority: z.enum(['low', 'medium', 'high']).default('medium'),
                dueAt: z.iso.datetime({ offset: true, local: true }).optional()
            })
        )
        .max(5)
})

export async function extractTodoCandidates(input: {
    accessToken: string
    since?: string
}): Promise<{ candidates: TodoCandidate[] }> {
    const query = input.since
        ? `newer_than:7d after:${input.since}`
        : 'newer_than:7d -category:promotions -category:social -category:updates'

    const ids = await listMessageIds(input.accessToken, query, 15)
    const messages = await Promise.all(
        ids.map(id => getMessageMetadata(input.accessToken, id))
    )

    const summary = messages
        .map((m, i) => {
            const subject = getHeader(m, 'Subject') ?? '(no subject)'
            const from = getHeader(m, 'From') ?? ''
            const date = getHeader(m, 'Date') ?? ''
            return `${i + 1}. From: ${from}\n   Date: ${date}\n   Subject: ${subject}\n   Snippet: ${m.snippet}`
        })
        .join('\n\n')

    if (!summary) {
        return { candidates: [] }
    }

    const today = new Date().toISOString()

    const result = await generateText({
        model: DEFAULT_MODEL,
        output: Output.object({ schema: candidateSchema }),
        prompt: `You triage a user's recent emails into a SMALL list of todos.
Today is ${today}.

ONLY create a todo when the email clearly requires the user to do something. Be ruthless — most emails should be skipped.

Create a todo for:
- A reply the sender is waiting on
- A meeting/event the user must confirm, prep for, or attend
- A form, document, or signature the user must submit
- A bill or payment with a deadline
- A task explicitly assigned to the user
- A deadline the user must hit

Skip (do NOT create a todo for):
- Newsletters, digests, marketing
- Social notifications (likes, follows, comments)
- Promotional offers, sales, coupons
- Receipts and order confirmations (unless action is needed)
- Shipping/delivery updates
- Automated alerts and status emails
- "FYI" / informational threads with no action requested
- Emails already handled or auto-resolved

Rules:
- Title: short, action-first ("Reply to Maya about the offsite"). Never restate the subject verbatim.
- priority: "high" only for urgent items with real consequences (deadlines, time-sensitive replies). Default "medium".
- dueAt: include an ISO datetime only if the email explicitly mentions a date and/or time. Use the user's local timezone. Omit otherwise.
- Notes: one short line of context (who/why). Omit if title is self-explanatory.

If nothing requires action, return { "candidates": [] }. Returning zero todos is correct and expected.

Emails:
${summary}

Return at most 5 todos.`
    })

    const candidates: TodoCandidate[] = (result.output?.candidates ?? []).map(c => ({
        ...c,
        source: 'gmail' as const
    }))

    return { candidates }
}

export async function handleGmailSyncRequest(request: Request): Promise<Response> {
    const accessToken = bearerToken(request)
    const body = (await request.json().catch(() => ({}))) as { since?: string }
    const { candidates } = await extractTodoCandidates({
        accessToken,
        since: body.since
    })
    return Response.json({ todos: candidates })
}
