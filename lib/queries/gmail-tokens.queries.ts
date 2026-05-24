import { eq } from 'drizzle-orm'

import { db } from '@/lib/db/client'
import { gmailTokens } from '@/lib/db/schema'
import type { GmailTokenRow } from '@/lib/models/gmail-token.model'

export async function findGmailTokenForUser(
    userId: string
): Promise<GmailTokenRow | undefined> {
    const rows = await db
        .select()
        .from(gmailTokens)
        .where(eq(gmailTokens.userId, userId))
        .limit(1)
    return rows[0]
}

export async function upsertGmailToken(
    row: typeof gmailTokens.$inferInsert
): Promise<void> {
    const existing = await findGmailTokenForUser(row.userId)
    if (existing) {
        await db.update(gmailTokens).set(row).where(eq(gmailTokens.userId, row.userId))
        return
    }
    await db.insert(gmailTokens).values(row)
}

export async function deleteGmailTokenForUser(userId: string): Promise<void> {
    await db.delete(gmailTokens).where(eq(gmailTokens.userId, userId))
}
