import { useMutation } from '@tanstack/react-query'

import { updateProfile } from '@/lib/services/auth.service'
import type { UpdateProfileInput } from '@/lib/z/auth'
import { updateAuthUser } from '@/stores/auth.store'

export function useUpdateProfile() {
    return useMutation({
        mutationFn: (input: UpdateProfileInput) => updateProfile(input),
        onSuccess: user => updateAuthUser(user)
    })
}
