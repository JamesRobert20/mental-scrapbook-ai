import { useTodos } from '@/hooks/queries/use-todos';
import { todoBelongsOnDay } from '@/lib/infrastructure/date-keys';
import { useInsightsSelectedDayKey } from '@/stores/insights.store';

export function useInsightsTodos() {
  const selectedDayKey = useInsightsSelectedDayKey();
  const query = useTodos();
  const all = query.data ?? [];
  const todosForDay = all.filter((todo) => todoBelongsOnDay(todo, selectedDayKey));

  return {
    ...query,
    selectedDayKey,
    todosForDay,
    important: todosForDay.filter((t) => t.category === 'important'),
    schedule: todosForDay.filter((t) => t.category === 'schedule'),
    general: todosForDay.filter((t) => t.category === 'general'),
  };
}
