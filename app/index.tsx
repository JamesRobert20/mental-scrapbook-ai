import { Redirect } from 'expo-router'

import { Routes } from '@/lib/navigation/routes'
import { useAuthStatus } from '@/stores/auth.store'

export default function Index() {
    const status = useAuthStatus()

    if (status === 'authenticated') {
        return <Redirect href={Routes.home} />
    }

    return <Redirect href={Routes.signIn} />
}
