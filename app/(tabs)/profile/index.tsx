import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/typography/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PROFILE_SECTIONS } from '@/constants/profile-settings';
import { colors, radii, spacing } from '@/constants/design-tokens';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileHero}>
          <Pressable onPress={pickAvatar} style={styles.avatarWrap} accessibilityLabel="Change profile photo">
            <View style={styles.avatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
              ) : (
                <AppText variant="headlineMd" color={colors.onPrimaryContainer}>
                  J
                </AppText>
              )}
            </View>
            <View style={styles.editBadge}>
              <IconSymbol name="pencil" size={14} color={colors.onPrimary} />
            </View>
          </Pressable>
          <AppText variant="headlineMd">Julian</AppText>
          <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
            Day 42 of mindful capture
          </AppText>
        </View>

        {PROFILE_SECTIONS.map((section, sectionIndex) => (
          <GlassCard key={section.title} noPadding>
            <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.sectionLabel}>
              {section.title}
            </AppText>
            {section.items.map((item, index) => (
              <Pressable
                key={item.slug}
                onPress={() =>
                  router.push({
                    pathname: '/profile/[slug]',
                    params: { slug: item.slug },
                  })
                }
                style={[styles.row, index < section.items.length - 1 && styles.rowBorder]}>
                <View style={styles.iconCircle}>
                  <IconSymbol name={item.icon} size={18} color={colors.onSurface} />
                </View>
                <AppText variant="bodyMd" style={styles.rowLabel}>
                  {item.label}
                </AppText>
                <IconSymbol name="chevron.right" size={18} color={colors.outline} />
              </Pressable>
            ))}
            {sectionIndex === PROFILE_SECTIONS.length - 1 ? <View style={styles.pulse} /> : null}
          </GlassCard>
        ))}
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
  },
  profileHero: {
    alignItems: 'center',
    gap: spacing.unit,
    paddingVertical: spacing.elementGap,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  sectionLabel: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: spacing.elementGap,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
  },
  pulse: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 12,
    height: 12,
    borderRadius: radii.full,
    backgroundColor: colors.accentSage,
    shadowColor: colors.accentSage,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
