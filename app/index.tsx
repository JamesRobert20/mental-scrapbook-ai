import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { DesignColors } from '@/constants/design';
import { useAuthHydrated, useAuthSession } from '@/stores/auth-store';

export default function Index() {
  const session = useAuthSession();
  const hasHydrated = useAuthHydrated();

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: DesignColors.background }}>
        <ActivityIndicator size="large" color={DesignColors.primary} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Redirect href="/login" />;
}
