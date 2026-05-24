import type { InferSelectModel } from 'drizzle-orm'

import { todos } from '@/lib/db/schema'

export type TodoRow = InferSelectModel<typeof todos>

export type TodoSource = 'manual' | 'voice' | 'gmail'
export type TodoPriority = 'low' | 'medium' | 'high'

export type Todo = {
    id: string
    userId: string
    title: string
    notes: string | null
    dueAt: string | null
    priority: TodoPriority
    source: TodoSource
    createdAt: string
    completedAt: string | null
}

export function mapTodoRow(row: TodoRow): Todo {
    return {
        id: row.id,
        userId: row.userId,
        title: row.title,
        notes: row.notes,
        dueAt: row.dueAt,
        priority: row.priority as TodoPriority,
        source: row.source as TodoSource,
        createdAt: row.createdAt,
        completedAt: row.completedAt
    }
}
