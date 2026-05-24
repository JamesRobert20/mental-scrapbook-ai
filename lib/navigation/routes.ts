import type { Href } from 'expo-router'

export const Routes = {
    home: '/(app)' as Href,
    signIn: '/(auth)/sign-in' as Href,
    signUp: '/(auth)/sign-up' as Href,
    insights: '/(app)/insights' as Href,
    capture: '/(app)' as Href,
    profile: '/(app)/profile' as Href,
    settings: {
        personalInfo: '/(app)/profile/personal-info' as Href,
        notifications: '/(app)/profile/notifications' as Href,
        language: '/(app)/profile/language' as Href,
        voice: '/(app)/profile/voice' as Href,
        syncGmail: '/(app)/profile/sync-gmail' as Href,
        calendar: '/(app)/profile/calendar' as Href,
        developer: '/(app)/profile/developer' as Href
    }
} as const
