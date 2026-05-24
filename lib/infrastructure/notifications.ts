// Local notifications only. Best-effort in Expo Go (most reliable on iOS).
// Remote push is not supported in Expo Go SDK 53+; see BACKGROUND.md.
import * as Notifications from 'expo-notifications'

let configured = false

function configureOnce(): void {
    if (configured) return
    configured = true
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false
        })
    })
}

export async function ensureNotificationPermission(): Promise<boolean> {
    configureOnce()
    const current = await Notifications.getPermissionsAsync()
    if (current.granted) return true
    if (!current.canAskAgain) return false
    const next = await Notifications.requestPermissionsAsync()
    return next.granted
}

export async function fireLocalNotification(input: {
    title: string
    body?: string
    data?: Record<string, unknown>
}): Promise<void> {
    configureOnce()
    await Notifications.scheduleNotificationAsync({
        content: {
            title: input.title,
            body: input.body ?? '',
            data: input.data ?? {}
        },
        trigger: null
    })
}

export async function scheduleLocalNotification(input: {
    identifier: string
    title: string
    body?: string
    fireAt: Date
    data?: Record<string, unknown>
}): Promise<string | null> {
    configureOnce()
    const delaySeconds = Math.floor((input.fireAt.getTime() - Date.now()) / 1000)
    if (delaySeconds <= 0) return null

    return Notifications.scheduleNotificationAsync({
        identifier: input.identifier,
        content: {
            title: input.title,
            body: input.body ?? '',
            data: input.data ?? {}
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delaySeconds,
            repeats: false
        }
    })
}

export async function cancelLocalNotification(identifier: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(identifier)
    } catch {
        // identifier may not exist; cancellation is best-effort
    }
}

export async function getScheduledIdentifiers(): Promise<string[]> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    return scheduled.map(n => n.identifier)
}
