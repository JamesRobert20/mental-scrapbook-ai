import * as Haptics from 'expo-haptics'

type Tone = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection'

// Haptics are best-effort UX polish; never throw, never await.
export function tap(tone: Tone = 'light'): void {
    switch (tone) {
        case 'medium':
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            return
        case 'heavy':
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            return
        case 'success':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            return
        case 'warning':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
            return
        case 'error':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            return
        case 'selection':
            void Haptics.selectionAsync()
            return
        case 'light':
        default:
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
}
