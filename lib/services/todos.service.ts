import { createId } from '@/lib/infrastructure/id'
import { mapTodoRow, type Todo } from '@/lib/models/todo.model'
import * as todosQueries from '@/lib/queries/todos.queries'
import { getCurrentUser } from '@/lib/services/auth.service'
import { ValidationError } from '@/lib/types/errors'
import { createTodoSchema, type CreateTodoInput } from '@/lib/z/todo'

async function requireUserId(): Promise<string> {
    const user = await getCurrentUser()
    if (!user) {
        throw new ValidationError('You must be signed in')
    }
    return user.id
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
        completedAt: null
    })

    return mapTodoRow(row)
}

export async function completeTodoForCurrentUser(todoId: string): Promise<void> {
    const userId = await requireUserId()
    await todosQueries.completeTodoById(todoId, userId)
}
