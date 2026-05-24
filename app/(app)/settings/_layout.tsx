import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.light.background },
        headerTintColor: Colors.light.onBackground,
        contentStyle: { backgroundColor: Colors.light.background },
      }}>
      <Stack.Screen name="personal-info" options={{ title: 'Personal Information' }} />
      <Stack.Screen name="security" options={{ title: 'Security' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="language" options={{ title: 'Language' }} />
      <Stack.Screen name="voice" options={{ title: 'Voice' }} />
      <Stack.Screen name="sync-gmail" options={{ title: 'Sync Gmail' }} />
    </Stack>
  );
}
