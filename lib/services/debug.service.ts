// Builds a redacted snapshot of every device-side table for debugging.
// Sensitive fields (password hashes, OAuth tokens, session tokens) are masked
// so the JSON is safe to share with a teammate or attach to a bug report.
import { File, Paths } from 'expo-file-system'

import { db } from '@/lib/db/client'
import { gmailTokens, sessions, todos, users } from '@/lib/db/schema'

type Snapshot = {
    capturedAt: string
    counts: {
        users: number
        sessions: number
        todos: number
        gmailTokens: number
    }
    tables: {
        users: unknown[]
        sessions: unknown[]
        todos: unknown[]
        gmailTokens: unknown[]
    }
}

function maskToken(value: string | null | undefined): string | null {
    if (!value) return null
    if (value.length <= 8) return '***'
    return `${value.slice(0, 4)}…${value.slice(-2)} (len=${value.length})`
}

export async function buildDatabaseSnapshot(): Promise<Snapshot> {
    const [userRows, sessionRows, todoRows, gmailRows] = await Promise.all([
        db.select().from(users),
        db.select().from(sessions),
        db.select().from(todos),
        db.select().from(gmailTokens)
    ])

    return {
        capturedAt: new Date().toISOString(),
        counts: {
            users: userRows.length,
            sessions: sessionRows.length,
            todos: todoRows.length,
            gmailTokens: gmailRows.length
        },
        tables: {
            users: userRows.map(u => ({
                ...u,
                passwordHash: maskToken(u.passwordHash)
            })),
            sessions: sessionRows.map(s => ({
                ...s,
                token: maskToken(s.token)
            })),
            todos: todoRows,
            gmailTokens: gmailRows.map(g => ({
                ...g,
                accessToken: maskToken(g.accessToken),
                refreshToken: maskToken(g.refreshToken)
            }))
        }
    }
}

export async function writeSnapshotToFile(): Promise<File> {
    const snapshot = await buildDatabaseSnapshot()
    const file = new File(Paths.document, 'murmur-snapshot.json')
    if (file.exists) file.delete()
    file.create()
    file.write(JSON.stringify(snapshot, null, 2))
    return file
}
