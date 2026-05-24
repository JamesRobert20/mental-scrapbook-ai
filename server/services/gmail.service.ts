// Tokens are persisted on the client (secure-store + gmail_tokens); the client passes
// the access token in the Authorization header on every Gmail-related request.
import { generateText, Output } from 'ai';
import { z } from 'zod';

import {
  fetchUserEmail,
  getHeader,
  getMessageMetadata,
  listMessageIds,
} from '@/server/integrations/gmail/api';
import {
  exchangeAuthCode,
  refreshAccessToken,
} from '@/server/integrations/gmail/oauth';

const DEFAULT_MODEL = process.env.AI_GATEWAY_CHAT_MODEL ?? 'anthropic/claude-sonnet-4.5';

const callbackSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.url(),
  codeVerifier: z.string().min(1),
});

export async function handleGmailCallback(request: Request): Promise<Response> {
  const body = await request.json();
  const parsed = callbackSchema.parse(body);

  const tokens = await exchangeAuthCode(parsed);
  const email = await fetchUserEmail(tokens.access_token);

  return Response.json({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? null,
    expiresIn: tokens.expires_in,
    email,
  });
}

const refreshSchema = z.object({ refreshToken: z.string().min(1) });

export async function handleGmailRefresh(request: Request): Promise<Response> {
  const { refreshToken } = refreshSchema.parse(await request.json());
  const tokens = await refreshAccessToken(refreshToken);
  return Response.json({
    accessToken: tokens.access_token,
    expiresIn: tokens.expires_in,
  });
}

export type TodoCandidate = {
  title: string;
  notes?: string;
  category: 'important' | 'schedule' | 'general';
  source: 'gmail';
};

function bearerToken(request: Request): string {
  const header = request.headers.get('Authorization');
  if (!header?.toLowerCase().startsWith('bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }
  return header.slice('bearer '.length).trim();
}

const candidateSchema = z.object({
  candidates: z
    .array(
      z.object({
        title: z.string().min(1),
        notes: z.string().optional(),
        category: z.enum(['important', 'schedule', 'general']).default('general'),
      }),
    )
    .max(10),
});

export async function extractTodoCandidates(input: {
  accessToken: string;
  since?: string;
}): Promise<{ candidates: TodoCandidate[] }> {
  const query = input.since
    ? `newer_than:7d after:${input.since}`
    : 'newer_than:7d -category:promotions -category:social';

  const ids = await listMessageIds(input.accessToken, query, 15);
  const messages = await Promise.all(
    ids.map((id) => getMessageMetadata(input.accessToken, id)),
  );

  const summary = messages
    .map((m, i) => {
      const subject = getHeader(m, 'Subject') ?? '(no subject)';
      const from = getHeader(m, 'From') ?? '';
      return `${i + 1}. From: ${from}\n   Subject: ${subject}\n   Snippet: ${m.snippet}`;
    })
    .join('\n\n');

  if (!summary) {
    return { candidates: [] };
  }

  const result = await generateText({
    model: DEFAULT_MODEL,
    output: Output.object({ schema: candidateSchema }),
    prompt: `You are extracting actionable todos from a user's recent emails.
Only extract items that are clear, concrete actions the user needs to take.
Skip newsletters, marketing, social notifications. Be conservative.

Categories:
- "important": time-sensitive or high-priority (deadlines, replies expected)
- "schedule": has a specific date/time (meetings, appointments)
- "general": everything else

Emails:
${summary}

Return at most 5 todos.`,
  });

  const candidates: TodoCandidate[] = (result.output?.candidates ?? []).map((c) => ({
    ...c,
    source: 'gmail' as const,
  }));

  return { candidates };
}

export async function handleGmailSyncRequest(request: Request): Promise<Response> {
  const accessToken = bearerToken(request);
  const body = (await request.json().catch(() => ({}))) as { since?: string };
  const { candidates } = await extractTodoCandidates({
    accessToken,
    since: body.since,
  });
  return Response.json({ todos: candidates });
}
