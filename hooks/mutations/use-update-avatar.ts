import { useMutation } from '@tanstack/react-query'

import { updateAvatar } from '@/lib/services/auth.service'
import { updateAuthUser } from '@/stores/auth.store'

export function useUpdateAvatar() {
    return useMutation({
        mutationFn: (sourceUri: string) => updateAvatar(sourceUri),
        onSuccess: user => updateAuthUser(user)
    })
}
