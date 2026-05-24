import { useEffect, useRef } from 'react'

import { useTodos } from '@/hooks/queries/use-todos'
import { hasScheduledTime } from '@/lib/infrastructure/date-keys'
import {
    cancelLocalNotification,
    ensureNotificationPermission,
    scheduleLocalNotification
} from '@/lib/infrastructure/notifications'
import type { Todo } from '@/lib/models/todo.model'
import {
    useNotificationsEnabled,
    useReminderLeadMinutes
} from '@/stores/preferences.store'

const LOOKAHEAD_HOURS = 24

function reminderId(todoId: string): string {
    return `todo-reminder-${todoId}`
}

function pickUpcoming(todos: Todo[], leadMinutes: number): Todo[] {
    const now = Date.now()
    const horizon = now + LOOKAHEAD_HOURS * 60 * 60 * 1000
    return todos.filter(t => {
        if (t.completedAt) return false
        if (!hasScheduledTime(t.dueAt)) return false
        const fireAt = new Date(t.dueAt!).getTime() - leadMinutes * 60 * 1000
        return fireAt > now && fireAt <= horizon
    })
}

export function useTodoReminders(): void {
    const { data: todos } = useTodos()
    const enabled = useNotificationsEnabled()
    const leadMinutes = useReminderLeadMinutes()
    const scheduledRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (!enabled || !todos) return

        let cancelled = false

        ;(async () => {
            const granted = await ensureNotificationPermission()
            if (!granted || cancelled) return

            const upcoming = pickUpcoming(todos, leadMinutes)
            const desired = new Set(upcoming.map(t => t.id))
            const previous = scheduledRef.current

            for (const id of previous) {
                if (!desired.has(id)) {
                    await cancelLocalNotification(reminderId(id))
                }
            }

            for (const todo of upcoming) {
                if (previous.has(todo.id)) continue
                const fireAt = new Date(
                    new Date(todo.dueAt!).getTime() - leadMinutes * 60 * 1000
                )
                await scheduleLocalNotification({
                    identifier: reminderId(todo.id),
                    title: `Soon: ${todo.title}`,
                    body: `Starts in about ${leadMinutes} min.`,
                    fireAt,
                    data: { todoId: todo.id }
                })
            }

            scheduledRef.current = desired
        })()

        return () => {
            cancelled = true
        }
    }, [enabled, leadMinutes, todos])

    useEffect(() => {
        if (enabled) return
        const previous = scheduledRef.current
        if (previous.size === 0) return
        ;(async () => {
            for (const id of previous) {
                await cancelLocalNotification(reminderId(id))
            }
        })()
        scheduledRef.current = new Set()
    }, [enabled])
}
