import { Redirect, Tabs } from 'expo-router';

import PillTabBar from '@/components/ui/pill-tab-bar';
import { Routes } from '@/lib/navigation/routes';
import { useAuthStatus } from '@/stores/auth.store';

export default function AppLayout() {
  const status = useAuthStatus();

  if (status !== 'authenticated') {
    return <Redirect href={Routes.signIn} />;
  }

  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="index" options={{ title: 'Capture' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
