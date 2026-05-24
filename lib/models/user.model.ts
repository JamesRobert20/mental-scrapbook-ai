import type { InferSelectModel } from 'drizzle-orm'

import { users } from '@/lib/db/schema'

export type UserRow = InferSelectModel<typeof users>

export type User = {
    id: string
    email: string
    firstName: string
    lastName: string
    avatarUri: string | null
    createdAt: string
}

export type SessionUser = Pick<
    User,
    'id' | 'email' | 'firstName' | 'lastName' | 'avatarUri'
>

export function mapUserRow(row: UserRow): SessionUser {
    return {
        id: row.id,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        avatarUri: row.avatarUri ?? null
    }
}
