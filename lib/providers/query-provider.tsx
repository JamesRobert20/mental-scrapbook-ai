import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'

type Props = {
    children: ReactNode
}

export default function QueryProvider({ children }: Props) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        retry: 1
                    }
                }
            })
    )

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
