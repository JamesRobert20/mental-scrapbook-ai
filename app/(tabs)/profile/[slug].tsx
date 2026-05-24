import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileDetailContent } from '@/components/profile/profile-detail-content';
import { AppText } from '@/components/typography/app-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import {
  PROFILE_SETTINGS_BY_SLUG,
  type ProfileSettingSlug,
} from '@/constants/profile-settings';
import { colors, spacing } from '@/constants/design-tokens';

export default function ProfileSettingDetailScreen() {
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const setting = PROFILE_SETTINGS_BY_SLUG[slug as ProfileSettingSlug];

  if (!setting) {
    return (
      <View style={styles.screen}>
        <ScreenHeader showBack onBack={() => router.back()} />
        <View style={styles.fallback}>
          <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
            This setting could not be found.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        <AppText variant="headlineMd" style={styles.pageTitle}>
          {setting.label}
        </AppText>
        <ProfileDetailContent slug={setting.slug} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: spacing.elementGap,
    paddingTop: spacing.unit,
  },
  pageTitle: {
    marginBottom: 4,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.containerPaddingMobile,
  },
});
