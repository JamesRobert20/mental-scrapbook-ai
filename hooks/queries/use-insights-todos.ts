import { useTodos } from '@/hooks/queries/use-todos'
import { hasScheduledTime, todoBelongsOnDay } from '@/lib/infrastructure/date-keys'
import { useInsightsSelectedDayKey } from '@/stores/insights.store'

export function useInsightsTodos() {
    const selectedDayKey = useInsightsSelectedDayKey()
    const query = useTodos()
    const all = query.data ?? []
    const todosForDay = all.filter(todo => todoBelongsOnDay(todo, selectedDayKey))

    const important = todosForDay.filter(t => t.priority === 'high')
    const schedule = todosForDay
        .filter(t => hasScheduledTime(t.dueAt))
        .sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime())
    const general = todosForDay.filter(
        t => t.priority !== 'high' && !hasScheduledTime(t.dueAt)
    )

    return {
        ...query,
        selectedDayKey,
        todosForDay,
        important,
        schedule,
        general
    }
}
