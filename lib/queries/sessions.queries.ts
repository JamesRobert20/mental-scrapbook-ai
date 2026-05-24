import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { sessions } from '@/lib/db/schema';
import type { SessionRow } from '@/lib/models/session.model';

export async function insertSession(row: typeof sessions.$inferInsert): Promise<void> {
  await db.insert(sessions).values(row);
}

export async function findSessionByToken(token: string): Promise<SessionRow | undefined> {
  const rows = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  return rows[0];
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteSessionsForUser(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
