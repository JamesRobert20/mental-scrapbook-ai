import { useMutation, useQueryClient } from '@tanstack/react-query'

import { runGmailSyncForCurrentUser } from '@/lib/services/gmail.service'

export function useGmailSync() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: runGmailSyncForCurrentUser,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['todos'] })
            void queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] })
        }
    })
}
