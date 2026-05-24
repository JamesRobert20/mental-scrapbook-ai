import { apiUrl } from '@/lib/infrastructure/api-url'
import {
    clearGmailTokens,
    getGmailAccessToken,
    getGmailRefreshToken,
    setGmailAccessToken,
    setGmailRefreshToken
} from '@/lib/infrastructure/secure-store'
import { mapGmailTokenRow } from '@/lib/models/gmail-token.model'
import * as gmailQueries from '@/lib/queries/gmail-tokens.queries'
import { getCurrentUser } from '@/lib/services/auth.service'
import { IntegrationError, ValidationError } from '@/lib/types/errors'

export type GmailTokensResponse = {
    accessToken: string
    refreshToken: string | null
    expiresIn: number
    email: string | null
}

export type GmailSyncResponse = {
    todos: {
        title: string
        notes?: string
        priority: 'low' | 'medium' | 'high'
        dueAt?: string
        source: 'gmail'
    }[]
}

export async function getGmailConnectionForCurrentUser() {
    const user = await getCurrentUser()
    if (!user) return null

    const row = await gmailQueries.findGmailTokenForUser(user.id)
    return row ? mapGmailTokenRow(row) : null
}

export async function persistGmailTokensForCurrentUser(
    tokens: GmailTokensResponse
): Promise<void> {
    const user = await getCurrentUser()
    if (!user) {
        throw new ValidationError('You must be signed in')
    }

    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString()

    await gmailQueries.upsertGmailToken({
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? '',
        expiresAt,
        email: tokens.email ?? 'unknown'
    })

    await setGmailAccessToken(tokens.accessToken)
    if (tokens.refreshToken) {
        await setGmailRefreshToken(tokens.refreshToken)
    }
}

export async function disconnectGmailForCurrentUser(): Promise<void> {
    const user = await getCurrentUser()
    if (!user) return

    await gmailQueries.deleteGmailTokenForUser(user.id)
    await clearGmailTokens()
}

async function refreshGmailAccessTokenIfNeeded(): Promise<string> {
    const refreshToken = await getGmailRefreshToken()
    if (!refreshToken) {
        throw new IntegrationError('Gmail is not connected', 'GMAIL_NOT_CONNECTED')
    }

    const response = await fetch(apiUrl('/api/gmail/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
        throw new IntegrationError(
            'Failed to refresh Gmail token',
            'GMAIL_REFRESH_FAILED'
        )
    }

    const data = (await response.json()) as { accessToken: string; expiresIn: number }
    await setGmailAccessToken(data.accessToken)

    const user = await getCurrentUser()
    if (user) {
        const row = await gmailQueries.findGmailTokenForUser(user.id)
        if (row) {
            await gmailQueries.upsertGmailToken({
                ...row,
                accessToken: data.accessToken,
                expiresAt: new Date(Date.now() + data.expiresIn * 1000).toISOString()
            })
        }
    }

    return data.accessToken
}

export async function getValidGmailAccessToken(): Promise<string> {
    let token = await getGmailAccessToken()
    if (token) return token

    return refreshGmailAccessTokenIfNeeded()
}

export async function syncGmailTodos(input?: {
    since?: string
}): Promise<GmailSyncResponse> {
    const token = await getValidGmailAccessToken()

    const response = await fetch(apiUrl('/api/gmail/sync'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(input ?? {})
    })

    if (!response.ok) {
        throw new IntegrationError('Gmail sync failed', 'GMAIL_SYNC_FAILED')
    }

    return response.json() as Promise<GmailSyncResponse>
}

export async function exchangeGmailAuthCode(params: {
    code: string
    redirectUri: string
    codeVerifier: string
}): Promise<GmailTokensResponse> {
    const response = await fetch(apiUrl('/api/gmail/callback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    })

    if (!response.ok) {
        throw new IntegrationError('Gmail authorization failed', 'GMAIL_OAUTH_FAILED')
    }

    return response.json() as Promise<GmailTokensResponse>
}
