import { useMutation } from '@tanstack/react-query'

import { tap } from '@/lib/infrastructure/haptics'
import { signIn } from '@/lib/services/auth.service'
import { setAuthAuthenticated } from '@/stores/auth.store'
import type { SignInInput } from '@/lib/z/auth'

export function useSignIn() {
    return useMutation({
        mutationFn: (input: SignInInput) => signIn(input),
        onSuccess: ({ user }) => {
            tap('success')
            setAuthAuthenticated(user)
        },
        onError: () => tap('error')
    })
}
