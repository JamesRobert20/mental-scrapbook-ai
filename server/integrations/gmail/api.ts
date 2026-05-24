const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

export type GmailMessageHeader = { name: string; value: string };

export type GmailMessage = {
  id: string;
  snippet: string;
  payload: {
    headers: GmailMessageHeader[];
  };
};

export async function listMessageIds(
  accessToken: string,
  query: string,
  maxResults = 20,
): Promise<string[]> {
  const url = new URL(`${GMAIL_BASE}/messages`);
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', String(maxResults));

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Gmail listMessages failed (${response.status})`);
  }
  const data = (await response.json()) as { messages?: { id: string }[] };
  return (data.messages ?? []).map((m) => m.id);
}

// `format=metadata` skips fetching the full body — cheaper quota, enough for snippets.
export async function getMessageMetadata(
  accessToken: string,
  id: string,
): Promise<GmailMessage> {
  const url = new URL(`${GMAIL_BASE}/messages/${id}`);
  url.searchParams.set('format', 'metadata');
  url.searchParams.append('metadataHeaders', 'Subject');
  url.searchParams.append('metadataHeaders', 'From');
  url.searchParams.append('metadataHeaders', 'Date');

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Gmail getMessage failed (${response.status})`);
  }
  return response.json() as Promise<GmailMessage>;
}

export function getHeader(message: GmailMessage, name: string): string | undefined {
  return message.payload.headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value;
}

export async function fetchUserEmail(accessToken: string): Promise<string | null> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { email?: string };
  return data.email ?? null;
}
