import type { InferSelectModel } from 'drizzle-orm'

import { gmailTokens } from '@/lib/db/schema'

export type GmailTokenRow = InferSelectModel<typeof gmailTokens>

export type GmailConnection = {
    email: string
    expiresAt: string
    lastSyncedAt: string | null
    lastSeenMessageId: string | null
}

export function mapGmailTokenRow(row: GmailTokenRow): GmailConnection {
    return {
        email: row.email,
        expiresAt: row.expiresAt,
        lastSyncedAt: row.lastSyncedAt ?? null,
        lastSeenMessageId: row.lastSeenMessageId ?? null
    }
}
