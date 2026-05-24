import { Stack } from 'expo-router'

import { Colors } from '@/constants/theme'

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: Colors.light.background },
                headerTintColor: Colors.light.onBackground,
                headerBackTitle: 'Profile',
                contentStyle: { backgroundColor: Colors.light.background }
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="personal-info"
                options={{ title: 'Personal Information' }}
            />
            <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
            <Stack.Screen name="language" options={{ title: 'Language' }} />
            <Stack.Screen name="voice" options={{ title: 'Voice' }} />
            <Stack.Screen name="sync-gmail" options={{ title: 'Sync Gmail' }} />
            <Stack.Screen name="calendar" options={{ title: 'Calendar' }} />
        </Stack>
    )
}
