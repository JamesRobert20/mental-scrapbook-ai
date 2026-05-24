import { useEffect } from 'react'

import { bootstrapSession } from '@/lib/services/auth.service'
import {
    setAuthAuthenticated,
    setAuthBootstrapping,
    setAuthUnauthenticated
} from '@/stores/auth.store'

export function useAuthBootstrap() {
    useEffect(() => {
        let cancelled = false

        async function run() {
            setAuthBootstrapping()
            const user = await bootstrapSession()
            if (cancelled) {
                return
            }
            if (user) {
                setAuthAuthenticated(user)
            } else {
                setAuthUnauthenticated()
            }
        }

        void run()
        return () => {
            cancelled = true
        }
    }, [])
}
