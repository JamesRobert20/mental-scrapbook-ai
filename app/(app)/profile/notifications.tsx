import { Ionicons } from '@expo/vector-icons'
import { useCallback } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import SettingsSection from '@/components/profile/settings-section'
import ToggleRow from '@/components/profile/toggle-row'
import Text from '@/components/ui/text'
import { ensureNotificationPermission } from '@/lib/infrastructure/notifications'
import {
    setNotificationsEnabled,
    useNotificationsEnabled,
    useReminderLeadMinutes
} from '@/stores/preferences.store'
import { Colors, Radii, Spacing } from '@/constants/theme'

export default function NotificationsScreen() {
    const enabled = useNotificationsEnabled()
    const leadMinutes = useReminderLeadMinutes()

    const handleToggle = useCallback(async (next: boolean) => {
        if (next) {
            const granted = await ensureNotificationPermission()
            setNotificationsEnabled(granted)
            return
        }
        setNotificationsEnabled(false)
    }, [])

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
        >
            <SettingsSection title="Reminders">
                <ToggleRow
                    icon="notifications-outline"
                    label="Upcoming todo reminders"
                    description={`Get a heads up about ${leadMinutes} min before scheduled todos.`}
                    value={enabled}
                    onValueChange={value => void handleToggle(value)}
                />
            </SettingsSection>

            <View style={styles.noteCard}>
                <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={Colors.light.onSurfaceVariant}
                />
                <Text variant="bodySmall" muted style={styles.noteText}>
                    Reminders are scheduled locally and work best on iOS. Expo Go on
                    Android can&apos;t deliver some scheduled notifications when the app
                    is fully closed — a custom build fixes that.
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        padding: Spacing.screenPadding,
        paddingBottom: 140,
        gap: Spacing.lg
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
