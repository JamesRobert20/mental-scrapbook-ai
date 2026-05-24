import type { ApiErrorBody } from '@/lib/types/api'
import { apiUrl } from '@/lib/infrastructure/api-url'
import { getSessionToken } from '@/lib/infrastructure/secure-store'

type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>
}

export async function apiFetch<T>(
    path: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const token = await getSessionToken()
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(apiUrl(path), { ...options, headers })

    if (!response.ok) {
        const body = (await response.json().catch(() => null)) as ApiErrorBody | null
        throw new Error(body?.error?.message ?? `Request failed (${response.status})`)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}
