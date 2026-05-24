import { Stack } from 'expo-router'

import { useT } from '@/lib/i18n/t'
import { Colors } from '@/constants/theme'

export default function ProfileLayout() {
    const t = useT()
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: Colors.light.background },
                headerTintColor: Colors.light.onBackground,
                headerBackTitle: t('profile.title'),
                contentStyle: { backgroundColor: Colors.light.background }
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="personal-info"
                options={{ title: t('settings.personalInfo') }}
            />
            <Stack.Screen
                name="notifications"
                options={{ title: t('settings.notifications') }}
            />
            <Stack.Screen name="language" options={{ title: t('settings.language') }} />
            <Stack.Screen name="voice" options={{ title: t('settings.voice') }} />
            <Stack.Screen
                name="sync-gmail"
                options={{ title: t('settings.syncGmail') }}
            />
            <Stack.Screen name="calendar" options={{ title: t('settings.calendar') }} />
            <Stack.Screen name="developer" options={{ title: t('profile.developer') }} />
        </Stack>
    )
}
