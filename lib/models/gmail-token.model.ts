import type { InferSelectModel } from 'drizzle-orm';

import { gmailTokens } from '@/lib/db/schema';

export type GmailTokenRow = InferSelectModel<typeof gmailTokens>;

export type GmailConnection = {
  email: string;
  expiresAt: string;
};

export function mapGmailTokenRow(row: GmailTokenRow): GmailConnection {
  return { email: row.email, expiresAt: row.expiresAt };
}
