import type { Todo } from '@/lib/models/todo.model'

export function toDayKey(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export function todayDayKey(): string {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return toDayKey(now)
}

export function dayKeyFromIso(iso: string | null | undefined): string | null {
    if (!iso) return null
    const parsed = new Date(iso)
    if (Number.isNaN(parsed.getTime())) return null
    return toDayKey(parsed)
}

export function todoBelongsOnDay(todo: Todo, dayKey: string): boolean {
    const dueKey = dayKeyFromIso(todo.dueAt)
    if (dueKey) return dueKey === dayKey
    return dayKeyFromIso(todo.createdAt) === dayKey
}

export function hasScheduledTime(dueAt: string | null | undefined): boolean {
    if (!dueAt) return false
    const d = new Date(dueAt)
    if (Number.isNaN(d.getTime())) return false
    return d.getHours() !== 0 || d.getMinutes() !== 0
}

export function formatTimeLabel(dueAt: string | null | undefined): string | null {
    if (!hasScheduledTime(dueAt)) return null
    const d = new Date(dueAt as string)
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
