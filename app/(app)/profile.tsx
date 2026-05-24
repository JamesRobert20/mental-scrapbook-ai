import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import ScreenHeader from '@/components/layout/screen-header';
import SettingsRow from '@/components/profile/settings-row';
import SettingsSection from '@/components/profile/settings-section';
import Text from '@/components/ui/text';
import { Routes } from '@/lib/navigation/routes';
import { signOut } from '@/lib/services/auth.service';
import { setAuthUnauthenticated, useAuthUser } from '@/stores/auth.store';
import { Colors, Radii, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const user = useAuthUser();
  const displayName = user ? user.firstName : 'Guest';

  const handleSignOut = async () => {
    await signOut();
    setAuthUnauthenticated();
    router.replace(Routes.signIn);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
        <ScreenHeader />
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text variant="headline" style={styles.avatarText}>
              {displayName.charAt(0)}
            </Text>
          </View>
          <Text variant="headline">{displayName}</Text>
          <Text variant="bodySmall" muted>
            Day 42 of mindful capture
          </Text>
        </View>

        <SettingsSection title="Account">
          <SettingsRow
            label="Personal Information"
            icon="person-outline"
            onPress={() => router.push(Routes.settings.personalInfo)}
          />
          <SettingsRow
            label="Security & Privacy"
            icon="shield-outline"
            onPress={() => router.push(Routes.settings.security)}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsRow
            label="Notifications"
            icon="notifications-outline"
            onPress={() => router.push(Routes.settings.notifications)}
          />
          <SettingsRow
            label="Language"
            icon="globe-outline"
            onPress={() => router.push(Routes.settings.language)}
          />
          <SettingsRow
            label="Sync Gmail"
            icon="sync-outline"
            onPress={() => router.push(Routes.settings.syncGmail)}
          />
        </SettingsSection>

        <SettingsSection title="Session">
          <SettingsRow label="Sign Out" icon="log-out-outline" onPress={handleSignOut} destructive />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 120,
  },
  profile: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: 36,
  },
});
