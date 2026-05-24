import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    avatarUri: text('avatar_uri'),
    createdAt: text('created_at').notNull()
})

export const sessions = sqliteTable('sessions', {
    token: text('token').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: text('expires_at').notNull()
})

export const todos = sqliteTable('todos', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    notes: text('notes'),
    dueAt: text('due_at'),
    priority: text('priority').notNull(),
    source: text('source').notNull(),
    createdAt: text('created_at').notNull(),
    completedAt: text('completed_at')
})

export const gmailTokens = sqliteTable('gmail_tokens', {
    userId: text('user_id')
        .primaryKey()
        .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiresAt: text('expires_at').notNull(),
    email: text('email').notNull(),
    lastSyncedAt: text('last_synced_at'),
    lastSeenMessageId: text('last_seen_message_id')
})
