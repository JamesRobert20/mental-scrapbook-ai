import { Ionicons } from '@expo/vector-icons'
import * as Sharing from 'expo-sharing'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native'

import Text from '@/components/ui/text'
import { tap } from '@/lib/infrastructure/haptics'
import { buildDatabaseSnapshot, writeSnapshotToFile } from '@/lib/services/debug.service'
import { Colors, Radii, Spacing } from '@/constants/theme'

type Status =
    | { kind: 'idle' }
    | { kind: 'working' }
    | { kind: 'ready'; counts: Record<string, number>; capturedAt: string }
    | { kind: 'error'; message: string }

export default function DeveloperScreen() {
    const [status, setStatus] = useState<Status>({ kind: 'idle' })

    async function handleExport() {
        if (status.kind === 'working') return
        tap('selection')
        setStatus({ kind: 'working' })
        try {
            const snapshot = await buildDatabaseSnapshot()
            const file = await writeSnapshotToFile()
            setStatus({
                kind: 'ready',
                counts: snapshot.counts,
                capturedAt: snapshot.capturedAt
            })
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(file.uri, {
                    mimeType: 'application/json',
                    UTI: 'public.json',
                    dialogTitle: 'Murmur database snapshot'
                })
            }
        } catch (err) {
            setStatus({
                kind: 'error',
                message: err instanceof Error ? err.message : 'Snapshot failed'
            })
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
        >
            <Text variant="body" muted style={styles.intro}>
                Export a JSON snapshot of every device-side table. Useful for
                screenshotting state or attaching to a bug report. Passwords and OAuth
                tokens are masked.
            </Text>

            <Pressable
                onPress={handleExport}
                disabled={status.kind === 'working'}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    status.kind === 'working' && styles.buttonDisabled
                ]}
            >
                {status.kind === 'working' ? (
                    <ActivityIndicator color={Colors.light.onPrimary} />
                ) : (
                    <Ionicons
                        name="download-outline"
                        size={18}
                        color={Colors.light.onPrimary}
                    />
                )}
                <Text variant="body" style={styles.buttonLabel}>
                    {status.kind === 'working' ? 'Preparing…' : 'Export database JSON'}
                </Text>
            </Pressable>

            {status.kind === 'ready' ? (
                <View style={styles.card}>
                    <Text variant="bodySmall" muted style={styles.cardLine}>
                        Captured {new Date(status.capturedAt).toLocaleString()}
                    </Text>
                    <Text variant="bodySmall" style={styles.cardLine}>
                        users: {status.counts.users} · sessions: {status.counts.sessions}{' '}
                        · todos: {status.counts.todos} · gmail:{' '}
                        {status.counts.gmailTokens}
                    </Text>
                </View>
            ) : null}

            {status.kind === 'error' ? (
                <View style={[styles.card, styles.errorCard]}>
                    <Text variant="bodySmall" style={styles.errorText}>
                        {status.message}
                    </Text>
                </View>
            ) : null}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        padding: Spacing.screenPadding,
        paddingBottom: 140,
        gap: Spacing.lg
    },
    intro: {
        marginBottom: Spacing.xs
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.light.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radii.pill,
        borderCurve: 'continuous'
    },
    buttonPressed: {
        opacity: 0.85
    },
    buttonDisabled: {
        opacity: 0.6
    },
    buttonLabel: {
        color: Colors.light.onPrimary
    },
    card: {
        backgroundColor: Colors.light.surfaceContainer,
        borderRadius: Radii.md,
        borderCurve: 'continuous',
        padding: Spacing.md,
        gap: 4
    },
    cardLine: {
        lineHeight: 18
    },
    errorCard: {
        backgroundColor: 'rgba(186, 26, 26, 0.08)'
    },
    errorText: {
        color: Colors.light.error
    }
})
