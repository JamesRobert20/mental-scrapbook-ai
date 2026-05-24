import { useQuery } from '@tanstack/react-query'

import { listTodosForCurrentUser } from '@/lib/services/todos.service'

export function useTodos() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: listTodosForCurrentUser,
        staleTime: 1000 * 60
    })
}
