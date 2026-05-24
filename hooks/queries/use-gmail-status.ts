import { useQuery } from '@tanstack/react-query'

import { getGmailConnectionForCurrentUser } from '@/lib/services/gmail.service'

export function useGmailStatus() {
    return useQuery({
        queryKey: ['gmail', 'status'],
        queryFn: getGmailConnectionForCurrentUser,
        staleTime: 1000 * 30
    })
}
