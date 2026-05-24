import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'

import SettingsSection from '@/components/profile/settings-section'
import ToggleRow from '@/components/profile/toggle-row'
import Text from '@/components/ui/text'
import {
    ensureCalendarPermission,
    getOrCreateMentalScrapbookCalendarId
} from '@/lib/infrastructure/calendar'
import {
    backfillCalendarForCurrentUser,
    clearCalendarForCurrentUser,
    type CalendarBackfillSummary
} from '@/lib/services/todos.service'
import {
    setCalendarSyncEnabled,
    useCalendarSyncEnabled
} from '@/stores/preferences.store'
import { Colors, Radii, Spacing } from '@/constants/theme'

type Status =
    | { kind: 'idle' }
    | { kind: 'working'; label: string }
    | { kind: 'backfilled'; summary: CalendarBackfillSummary }
    | { kind: 'cleared'; removed: number }
    | { kind: 'denied' }
    | { kind: 'failed' }

export default function CalendarScreen() {
    const enabled = useCalendarSyncEnabled()
    const queryClient = useQueryClient()
    const [status, setStatus] = useState<Status>({ kind: 'idle' })

    const handleToggle = useCallback(
        async (next: boolean) => {
            if (!next) {
                setCalendarSyncEnabled(false)
                setStatus({ kind: 'working', label: 'Removing events…' })
                try {
                    const removed = await clearCalendarForCurrentUser()
                    setStatus({ kind: 'cleared', removed })
                    await queryClient.invalidateQueries({ queryKey: ['todos'] })
                } catch {
                    setStatus({ kind: 'failed' })
                }
                return
            }

            setStatus({ kind: 'working', label: 'Requesting permission…' })
            const granted = await ensureCalendarPermission()
            if (!granted) {
                setCalendarSyncEnabled(false)
                setStatus({ kind: 'denied' })
                return
            }
            try {
                await getOrCreateMentalScrapbookCalendarId()
                setCalendarSyncEnabled(true)
                setStatus({ kind: 'working', label: 'Adding scheduled todos…' })
                const summary = await backfillCalendarForCurrentUser()
                setStatus({ kind: 'backfilled', summary })
                await queryClient.invalidateQueries({ queryKey: ['todos'] })
            } catch {
                setStatus({ kind: 'failed' })
            }
        },
        [queryClient]
    )

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
        >
            <Text variant="body" muted style={styles.intro}>
                Add scheduled todos to your device calendar so you&apos;ll see them next
                to your other plans.
            </Text>

            <SettingsSection title="Calendar sync">
                <ToggleRow
                    icon="calendar-outline"
                    label="Add scheduled todos to my calendar"
                    description="A dedicated &ldquo;Murmur&rdquo; calendar keeps things tidy."
                    value={enabled}
                    disabled={status.kind === 'working'}
                    onValueChange={value => void handleToggle(value)}
                />
            </SettingsSection>

            <StatusCard status={status} />

            <View style={styles.noteCard}>
                <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={Colors.light.onSurfaceVariant}
                />
                <Text variant="bodySmall" muted style={styles.noteText}>
                    Only todos with a specific time are added. Completing a todo removes
                    its calendar event, and turning sync off removes all of them.
                </Text>
            </View>
        </ScrollView>
    )
}

function StatusCard({ status }: { status: Status }) {
    if (status.kind === 'idle') return null

    if (status.kind === 'working') {
        return (
            <View style={styles.statusCard}>
                <ActivityIndicator color={Colors.light.onSurfaceVariant} />
                <Text variant="bodySmall" muted style={styles.statusText}>
                    {status.label}
                </Text>
            </View>
        )
    }

    if (status.kind === 'backfilled') {
        const { created, skipped, failed } = status.summary
        const message =
            created === 0
                ? 'No scheduled todos to add yet. New ones with a time will sync automatically.'
                : `Added ${created} todo${created === 1 ? '' : 's'} to your calendar.${failed > 0 ? ` (${failed} could not be added.)` : ''}${skipped > 0 && created > 0 ? ` Skipped ${skipped} without a specific time.` : ''}`
        return (
            <View style={styles.statusCard}>
                <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Colors.light.primary}
                />
                <Text variant="bodySmall" muted style={styles.statusText}>
                    {message}
                </Text>
            </View>
        )
    }

    if (status.kind === 'cleared') {
        return (
            <View style={styles.statusCard}>
                <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Colors.light.primary}
                />
                <Text variant="bodySmall" muted style={styles.statusText}>
                    {status.removed === 0
                        ? 'Calendar sync is off. Nothing to remove.'
                        : `Removed ${status.removed} event${status.removed === 1 ? '' : 's'} from your calendar.`}
                </Text>
            </View>
        )
    }

    if (status.kind === 'denied') {
        return (
            <View style={styles.statusCard}>
                <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={Colors.light.onSurfaceVariant}
                />
                <Text variant="bodySmall" muted style={styles.statusText}>
                    Calendar access was denied. Enable it in iOS Settings → Mental
                    Scrapbook → Calendars to try again.
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.statusCard}>
            <Ionicons
                name="alert-circle-outline"
                size={18}
                color={Colors.light.onSurfaceVariant}
            />
            <Text variant="bodySmall" muted style={styles.statusText}>
                Something went wrong syncing your calendar. Try toggling again.
            </Text>
        </View>
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
    statusCard: {
        flexDirection: 'row',
        gap: Spacing.sm,
        alignItems: 'flex-start',
        backgroundColor: Colors.light.surfaceContainer,
        borderRadius: Radii.md,
        borderCurve: 'continuous',
        padding: Spacing.md
    },
    statusText: {
        flex: 1,
        lineHeight: 18
    },
    noteCard: {
        flexDirection: 'row',
        gap: Spacing.sm,
        backgroundColor: Colors.light.surfaceContainer,
        borderRadius: Radii.md,
        borderCurve: 'continuous',
        padding: Spacing.md
    },
    noteText: {
        flex: 1,
        lineHeight: 18
    }
})
