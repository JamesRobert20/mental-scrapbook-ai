import { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { AuthRequest, ResponseType, type DiscoveryDocument } from 'expo-auth-session'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import Button from '@/components/ui/button'
import Text from '@/components/ui/text'
import { useGmailStatus } from '@/hooks/queries/use-gmail-status'
import {
    disconnectGmailForCurrentUser,
    exchangeGmailAuthCode,
    persistGmailTokensForCurrentUser
} from '@/lib/services/gmail.service'
import { Colors, Radii, Spacing } from '@/constants/theme'

WebBrowser.maybeCompleteAuthSession()

const discovery: DiscoveryDocument = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke'
}

const PERKS: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
    {
        icon: 'sparkles-outline',
        title: 'Turn emails into todos',
        body: 'Mental Scrapbook suggests tasks from recent messages so nothing slips through.'
    },
    {
        icon: 'eye-outline',
        title: 'Read-only access',
        body: 'We can read your inbox to find tasks. We never send, delete, or edit anything.'
    },
    {
        icon: 'lock-closed-outline',
        title: 'You stay in control',
        body: 'Disconnect anytime from this screen. Your tokens stay on your device.'
    }
]

function getExpoProxyUrl(): string {
    const owner = Constants.expoConfig?.owner
    const slug = Constants.expoConfig?.slug
    if (!owner || !slug) {
        throw new Error('App is missing required configuration.')
    }
    return `https://auth.expo.io/@${owner}/${slug}`
}

function friendlyError(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('cancel') || lower.includes('dismiss')) {
        return 'Connection was cancelled.'
    }
    if (lower.includes('network') || lower.includes('fetch')) {
        return "We couldn't reach Google. Check your connection and try again."
    }
    if (lower.includes('configuration') || lower.includes('missing')) {
        return "Gmail isn't set up for this build yet."
    }
    return "We couldn't connect to Gmail. Please try again."
}

export default function SyncGmailScreen() {
    const queryClient = useQueryClient()
    const { data: connection, isLoading } = useGmailStatus()
    const [error, setError] = useState<string | null>(null)
    const [isAuthing, setIsAuthing] = useState(false)

    const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? ''

    const { mutateAsync: connect, isPending: isConnecting } = useMutation({
        mutationFn: persistGmailTokensForCurrentUser,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] })
            setError(null)
        },
        onError: (err: Error) => setError(friendlyError(err.message))
    })

    const { mutate: disconnect, isPending: isDisconnecting } = useMutation({
        mutationFn: disconnectGmailForCurrentUser,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] })
            setError(null)
        }
    })

    const handleConnect = useCallback(async () => {
        if (!googleClientId) {
            setError("Gmail isn't set up for this build yet.")
            return
        }

        setError(null)
        setIsAuthing(true)

        try {
            const proxyRedirect = getExpoProxyUrl()

            const request = new AuthRequest({
                clientId: googleClientId,
                redirectUri: proxyRedirect,
                responseType: ResponseType.Code,
                scopes: [
                    'openid',
                    'email',
                    'https://www.googleapis.com/auth/gmail.readonly'
                ],
                usePKCE: true,
                extraParams: { access_type: 'offline', prompt: 'consent' }
            })

            const authUrl = await request.makeAuthUrlAsync(discovery)
            const returnUrl = Linking.createURL('gmail-oauth')
            const startUrl = `${proxyRedirect}/start?${new URLSearchParams({
                authUrl,
                returnUrl
            }).toString()}`

            const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl)

            if (result.type === 'cancel' || result.type === 'dismiss') {
                return
            }

            if (result.type !== 'success' || !result.url) {
                setError("We couldn't connect to Gmail. Please try again.")
                return
            }

            const parsed = request.parseReturnUrl(result.url)
            const code = parsed.type === 'success' ? parsed.params.code : undefined
            const codeVerifier = request.codeVerifier

            if (!code || !codeVerifier) {
                setError("We couldn't connect to Gmail. Please try again.")
                return
            }

            const tokens = await exchangeGmailAuthCode({
                code,
                redirectUri: proxyRedirect,
                codeVerifier
            })
            await connect(tokens)
        } catch (err) {
            setError(friendlyError(err instanceof Error ? err.message : ''))
        } finally {
            setIsAuthing(false)
        }
    }, [googleClientId, connect])

    const isBusy = isAuthing || isConnecting || isDisconnecting

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color={Colors.light.primary} />
            </View>
        )
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
        >
            <View style={styles.hero}>
                <View style={styles.iconBubble}>
                    <Ionicons
                        name="mail-outline"
                        size={28}
                        color={Colors.light.primary}
                    />
                </View>
                <Text variant="headline" style={styles.heroTitle}>
                    {connection ? 'Gmail is connected' : 'Connect your Gmail'}
                </Text>
                <Text variant="body" muted style={styles.heroBody}>
                    {connection
                        ? 'Mental Scrapbook can now suggest todos from your recent emails.'
                        : 'Let Mental Scrapbook quietly turn the emails you care about into todos.'}
                </Text>
            </View>

            {connection ? (
                <View style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <View style={styles.statusBadge}>
                            <Ionicons
                                name="checkmark"
                                size={16}
                                color={Colors.light.onPrimary}
                            />
                        </View>
                        <View style={styles.statusBody}>
                            <Text variant="label" muted>
                                Signed in as
                            </Text>
                            <Text variant="body" selectable>
                                {connection.email}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.perks}>
                    {PERKS.map(perk => (
                        <View key={perk.title} style={styles.perkRow}>
                            <View style={styles.perkIcon}>
                                <Ionicons
                                    name={perk.icon}
                                    size={18}
                                    color={Colors.light.onSurfaceVariant}
                                />
                            </View>
                            <View style={styles.perkBody}>
                                <Text variant="body" style={styles.perkTitle}>
                                    {perk.title}
                                </Text>
                                <Text variant="bodySmall" muted>
                                    {perk.body}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {error ? (
                <View style={styles.errorRow}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={18}
                        color={Colors.light.error}
                    />
                    <Text variant="bodySmall" style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            ) : null}

            <View style={styles.actions}>
                {connection ? (
                    <Button
                        label={isDisconnecting ? 'Disconnecting…' : 'Disconnect Gmail'}
                        variant="ghost"
                        disabled={isBusy}
                        onPress={() => disconnect()}
                    />
                ) : (
                    <Button
                        label={
                            isAuthing || isConnecting ? 'Connecting…' : 'Connect Gmail'
                        }
                        disabled={isBusy}
                        onPress={() => void handleConnect()}
                    />
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.background
    },
    scroll: {
        padding: Spacing.screenPadding,
        paddingBottom: 140,
        gap: Spacing.xl
    },
    hero: {
        alignItems: 'center',
        gap: Spacing.sm,
        paddingTop: Spacing.md
    },
    iconBubble: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.light.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm
    },
    heroTitle: {
        textAlign: 'center'
    },
    heroBody: {
        textAlign: 'center',
        maxWidth: 320
    },
    statusCard: {
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: Colors.light.outline,
        padding: Spacing.lg
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md
    },
    statusBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusBody: {
        flex: 1,
        gap: 2
    },
    perks: {
        gap: Spacing.lg,
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: Colors.light.outline,
        padding: Spacing.lg
    },
    perkRow: {
        flexDirection: 'row',
        gap: Spacing.md
    },
    perkIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center'
    },
    perkBody: {
        flex: 1,
        gap: 2
    },
    perkTitle: {
        fontFamily: 'HankenGrotesk_600SemiBold'
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        backgroundColor: 'rgba(186, 26, 26, 0.06)',
        borderRadius: Radii.md,
        borderCurve: 'continuous',
        padding: Spacing.md
    },
    errorText: {
        flex: 1,
        color: Colors.light.error
    },
    actions: {
        marginTop: Spacing.sm
    }
})
