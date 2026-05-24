import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/lib/db/client'
import { todos } from '@/lib/db/schema'
import type { TodoRow } from '@/lib/models/todo.model'

export async function listTodosByUser(userId: string): Promise<TodoRow[]> {
    return db
        .select()
        .from(todos)
        .where(and(eq(todos.userId, userId), isNull(todos.completedAt)))
}

export async function insertTodo(row: typeof todos.$inferInsert): Promise<TodoRow> {
    await db.insert(todos).values(row)
    const rows = await db.select().from(todos).where(eq(todos.id, row.id)).limit(1)
    if (!rows[0]) {
        throw new Error('Failed to create todo')
    }
    return rows[0]
}

export async function findTodoByIdForUser(
    id: string,
    userId: string
): Promise<TodoRow | undefined> {
    const rows = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .limit(1)
    return rows[0]
}

export async function completeTodoById(id: string, userId: string): Promise<void> {
    await db
        .update(todos)
        .set({ completedAt: new Date().toISOString() })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
}

export async function setTodoCalendarEventId(
    id: string,
    userId: string,
    calendarEventId: string | null
): Promise<void> {
    await db
        .update(todos)
        .set({ calendarEventId })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
}

export async function listTodosWithCalendarEventForUser(
    userId: string
): Promise<TodoRow[]> {
    const rows = await db.select().from(todos).where(eq(todos.userId, userId))
    return rows.filter(r => r.calendarEventId !== null && r.calendarEventId !== '')
}
