import { apiUrl } from '@/lib/infrastructure/api-url'
import {
    clearGmailTokens,
    getGmailAccessToken,
    getGmailRefreshToken,
    setGmailAccessToken,
    setGmailRefreshToken
} from '@/lib/infrastructure/secure-store'
import { mapGmailTokenRow } from '@/lib/models/gmail-token.model'
import type { Todo } from '@/lib/models/todo.model'
import * as gmailQueries from '@/lib/queries/gmail-tokens.queries'
import { getCurrentUser } from '@/lib/services/auth.service'
import {
    createTodoForCurrentUser,
    listTodosForCurrentUser
} from '@/lib/services/todos.service'
import { IntegrationError, ValidationError } from '@/lib/types/errors'

export type GmailTokensResponse = {
    accessToken: string
    refreshToken: string | null
    expiresIn: number
    email: string | null
}

export type GmailSyncCandidate = {
    title: string
    notes?: string
    priority: 'low' | 'medium' | 'high'
    dueAt?: string
    source: 'gmail'
}

export type GmailSyncResponse = {
    todos: GmailSyncCandidate[]
    newestMessageId: string | null
    scanned: number
    skippedReason: 'no-new-messages' | 'inbox-empty' | null
}

export type GmailSyncRunResult = {
    created: Todo[]
    skipped: number
    newestMessageId: string | null
    skippedReason: GmailSyncResponse['skippedReason']
}

export async function getGmailConnectionForCurrentUser() {
    const user = await getCurrentUser()
    if (!user) return null

    const row = await gmailQueries.findGmailTokenForUser(user.id)
    return row ? mapGmailTokenRow(row) : null
}

export async function persistGmailTokensForCurrentUser(
    tokens: GmailTokensResponse
): Promise<void> {
    const user = await getCurrentUser()
    if (!user) {
        throw new ValidationError('You must be signed in')
    }

    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString()

    await gmailQueries.upsertGmailToken({
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? '',
        expiresAt,
        email: tokens.email ?? 'unknown'
    })

    await setGmailAccessToken(tokens.accessToken)
    if (tokens.refreshToken) {
        await setGmailRefreshToken(tokens.refreshToken)
    }
}

export async function disconnectGmailForCurrentUser(): Promise<void> {
    const user = await getCurrentUser()
    if (!user) return

    await gmailQueries.deleteGmailTokenForUser(user.id)
    await clearGmailTokens()
}

const TOKEN_REFRESH_BUFFER_MS = 60_000

async function refreshGmailAccessToken(): Promise<string> {
    const refreshToken = await getGmailRefreshToken()
    if (!refreshToken) {
        throw new IntegrationError('Gmail is not connected', 'GMAIL_NOT_CONNECTED')
    }

    const response = await fetch(apiUrl('/api/gmail/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
        throw new IntegrationError(
            'Failed to refresh Gmail token',
            'GMAIL_REFRESH_FAILED'
        )
    }

    const data = (await response.json()) as { accessToken: string; expiresIn: number }
    await setGmailAccessToken(data.accessToken)

    const user = await getCurrentUser()
    if (user) {
        const row = await gmailQueries.findGmailTokenForUser(user.id)
        if (row) {
            await gmailQueries.upsertGmailToken({
                ...row,
                accessToken: data.accessToken,
                expiresAt: new Date(Date.now() + data.expiresIn * 1000).toISOString()
            })
        }
    }

    return data.accessToken
}

async function isStoredTokenExpired(): Promise<boolean> {
    const user = await getCurrentUser()
    if (!user) return false
    const row = await gmailQueries.findGmailTokenForUser(user.id)
    if (!row?.expiresAt) return false
    const expiresAt = new Date(row.expiresAt).getTime()
    return Number.isFinite(expiresAt)
        ? expiresAt - Date.now() <= TOKEN_REFRESH_BUFFER_MS
        : false
}

export async function getValidGmailAccessToken(): Promise<string> {
    const token = await getGmailAccessToken()
    if (token && !(await isStoredTokenExpired())) return token
    return refreshGmailAccessToken()
}

async function postSyncOnce(
    token: string,
    body: Record<string, unknown>
): Promise<Response> {
    return fetch(apiUrl('/api/gmail/sync'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
}

export async function syncGmailTodos(input?: {
    since?: string
    lastSeenMessageId?: string | null
}): Promise<GmailSyncResponse> {
    const body = input ?? {}
    let token = await getValidGmailAccessToken()
    let response = await postSyncOnce(token, body)

    if (response.status === 401) {
        token = await refreshGmailAccessToken()
        response = await postSyncOnce(token, body)
    }

    if (!response.ok) {
        throw new IntegrationError('Gmail sync failed', 'GMAIL_SYNC_FAILED')
    }

    return response.json() as Promise<GmailSyncResponse>
}

function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export async function runGmailSyncForCurrentUser(): Promise<GmailSyncRunResult> {
    const user = await getCurrentUser()
    if (!user) {
        throw new ValidationError('You must be signed in')
    }

    const tokenRow = await gmailQueries.findGmailTokenForUser(user.id)
    if (!tokenRow) {
        throw new IntegrationError('Gmail is not connected', 'GMAIL_NOT_CONNECTED')
    }

    const response = await syncGmailTodos({
        lastSeenMessageId: tokenRow.lastSeenMessageId ?? null
    })

    const result: GmailSyncRunResult = {
        created: [],
        skipped: 0,
        newestMessageId: response.newestMessageId,
        skippedReason: response.skippedReason
    }

    if (response.todos.length > 0) {
        const existing = await listTodosForCurrentUser()
        const existingTitles = new Set(existing.map(t => normalizeTitle(t.title)))
        const cycleTitles = new Set<string>()

        for (const candidate of response.todos) {
            const key = normalizeTitle(candidate.title)
            if (!key) continue
            if (existingTitles.has(key) || cycleTitles.has(key)) {
                result.skipped += 1
                continue
            }
            cycleTitles.add(key)
            const todo = await createTodoForCurrentUser({
                title: candidate.title,
                notes: candidate.notes,
                priority: candidate.priority,
                dueAt: candidate.dueAt,
                source: 'gmail'
            })
            result.created.push(todo)
        }
    }

    await gmailQueries.updateGmailSyncCursor(user.id, {
        lastSyncedAt: new Date().toISOString(),
        lastSeenMessageId: response.newestMessageId ?? tokenRow.lastSeenMessageId ?? null
    })

    return result
}

export async function exchangeGmailAuthCode(params: {
    code: string
    redirectUri: string
    codeVerifier: string
}): Promise<GmailTokensResponse> {
    const response = await fetch(apiUrl('/api/gmail/callback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    })

    if (!response.ok) {
        throw new IntegrationError('Gmail authorization failed', 'GMAIL_OAUTH_FAILED')
    }

    return response.json() as Promise<GmailTokensResponse>
}
