import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import type { UserRow } from '@/lib/models/user.model';

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return rows[0];
}

export async function findUserById(id: string): Promise<UserRow | undefined> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0];
}

export async function insertUser(row: typeof users.$inferInsert): Promise<UserRow> {
  await db.insert(users).values(row);
  const created = await findUserById(row.id);
  if (!created) {
    throw new Error('Failed to create user');
  }
  return created;
}
