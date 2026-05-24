import { useQuery } from '@tanstack/react-query';

import { listTodosForCurrentUser } from '@/lib/services/todos.service';
import type { TodoCategory } from '@/lib/models/todo.model';

export function useTodos(category?: TodoCategory) {
  return useQuery({
    queryKey: category ? ['todos', category] : ['todos'],
    queryFn: () => listTodosForCurrentUser(category),
    staleTime: 1000 * 60,
  });
}
