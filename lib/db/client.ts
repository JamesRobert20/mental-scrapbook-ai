import { drizzle } from 'drizzle-orm/expo-sqlite'
import { openDatabaseSync } from 'expo-sqlite'

import * as schema from '@/lib/db/schema'

const DB_NAME = 'mental_scrapbook.db'

const expoDb = openDatabaseSync(DB_NAME)

expoDb.execSync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_uri TEXT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    due_at TEXT,
    priority TEXT NOT NULL,
    source TEXT NOT NULL,
    created_at TEXT NOT NULL,
    completed_at TEXT,
    calendar_event_id TEXT
  );
  CREATE TABLE IF NOT EXISTS gmail_tokens (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    email TEXT NOT NULL,
    last_synced_at TEXT,
    last_seen_message_id TEXT
  );
`)

for (const column of ['category', 'time_label']) {
    try {
        expoDb.execSync(`ALTER TABLE todos DROP COLUMN ${column};`)
    } catch {
        // column already absent on fresh installs
    }
}

for (const column of ['last_synced_at TEXT', 'last_seen_message_id TEXT']) {
    try {
        expoDb.execSync(`ALTER TABLE gmail_tokens ADD COLUMN ${column};`)
    } catch {
        // column already present on fresh installs
    }
}

try {
    expoDb.execSync(`ALTER TABLE users ADD COLUMN avatar_uri TEXT;`)
} catch {
    // column already present on fresh installs
}

try {
    expoDb.execSync(`ALTER TABLE todos ADD COLUMN calendar_event_id TEXT;`)
} catch {
    // column already present on fresh installs
}

export const db = drizzle(expoDb, { schema })
