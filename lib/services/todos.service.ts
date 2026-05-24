import {
    createCalendarEvent,
    deleteCalendarEvent,
    ensureCalendarPermission
} from '@/lib/infrastructure/calendar'
import { hasScheduledTime } from '@/lib/infrastructure/date-keys'
import { createId } from '@/lib/infrastructure/id'
import { mapTodoRow, type Todo } from '@/lib/models/todo.model'
import * as todosQueries from '@/lib/queries/todos.queries'
import { getCurrentUser } from '@/lib/services/auth.service'
import { ValidationError } from '@/lib/types/errors'
import { createTodoSchema, type CreateTodoInput } from '@/lib/z/todo'
import { getCalendarSyncEnabled } from '@/stores/preferences.store'

async function requireUserId(): Promise<string> {
    const user = await getCurrentUser()
    if (!user) {
        throw new ValidationError('You must be signed in')
    }
    return user.id
}

async function safeCreateCalendarEvent(todo: Todo): Promise<string | null> {
    if (!getCalendarSyncEnabled()) return null
    if (!hasScheduledTime(todo.dueAt)) return null
    try {
        const granted = await ensureCalendarPermission()
        if (!granted) return null
        return await createCalendarEvent({
            title: todo.title,
            startsAt: new Date(todo.dueAt!),
            notes: todo.notes
        })
    } catch (err) {
        console.warn('[todos] calendar event create failed', err)
        return null
    }
}

export async function listTodosForCurrentUser(): Promise<Todo[]> {
    const userId = await requireUserId()
    const rows = await todosQueries.listTodosByUser(userId)
    return rows.map(mapTodoRow)
}

export async function createTodoForCurrentUser(input: CreateTodoInput): Promise<Todo> {
    const parsed = createTodoSchema.parse(input)
    const userId = await requireUserId()

    const row = await todosQueries.insertTodo({
        id: createId(),
        userId,
        title: parsed.title,
        notes: parsed.notes ?? null,
        dueAt: parsed.dueAt ?? null,
        priority: parsed.priority,
        source: parsed.source,
        createdAt: new Date().toISOString(),
        completedAt: null,
        calendarEventId: null
    })

    let todo = mapTodoRow(row)

    const eventId = await safeCreateCalendarEvent(todo)
    if (eventId) {
        await todosQueries.setTodoCalendarEventId(todo.id, userId, eventId)
        todo = { ...todo, calendarEventId: eventId }
    }

    return todo
}

export async function completeTodoForCurrentUser(todoId: string): Promise<void> {
    const userId = await requireUserId()
    const existing = await todosQueries.findTodoByIdForUser(todoId, userId)
    await todosQueries.completeTodoById(todoId, userId)
    if (existing?.calendarEventId) {
        await deleteCalendarEvent(existing.calendarEventId)
        await todosQueries.setTodoCalendarEventId(todoId, userId, null)
    }
}

export type CalendarBackfillSummary = {
    created: number
    skipped: number
    failed: number
}

export async function backfillCalendarForCurrentUser(): Promise<CalendarBackfillSummary> {
    const userId = await requireUserId()
    const granted = await ensureCalendarPermission()
    if (!granted) return { created: 0, skipped: 0, failed: 0 }

    const rows = await todosQueries.listTodosByUser(userId)
    let created = 0
    let skipped = 0
    let failed = 0

    for (const row of rows) {
        const todo = mapTodoRow(row)
        if (todo.calendarEventId) {
            skipped += 1
            continue
        }
        if (!hasScheduledTime(todo.dueAt)) {
            skipped += 1
            continue
        }
        try {
            const eventId = await createCalendarEvent({
                title: todo.title,
                startsAt: new Date(todo.dueAt!),
                notes: todo.notes
            })
            await todosQueries.setTodoCalendarEventId(todo.id, userId, eventId)
            created += 1
        } catch (err) {
            console.warn('[todos] calendar backfill failed for', todo.id, err)
            failed += 1
        }
    }

    return { created, skipped, failed }
}

export async function clearCalendarForCurrentUser(): Promise<number> {
    const userId = await requireUserId()
    const rows = await todosQueries.listTodosWithCalendarEventForUser(userId)
    let removed = 0
    for (const row of rows) {
        if (!row.calendarEventId) continue
        await deleteCalendarEvent(row.calendarEventId)
        await todosQueries.setTodoCalendarEventId(row.id, userId, null)
        removed += 1
    }
    return removed
}
