import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { GlassSurface } from '@/components/ui/glass-surface';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingsRow } from '@/components/ui/settings-row';
import { DesignColors, DesignRadii, DesignSpacing } from '@/constants/design';
import { useAuthSession, useAuthStore } from '@/stores/auth-store';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop';
const ACCOUNT = [
  { icon: 'person-outline' as const, label: 'Personal Information' },
  { icon: 'shield-outline' as const, label: 'Security & Privacy' },
  { icon: 'card-outline' as const, label: 'Subscription Plan' },
];

const DATA = [
  { icon: 'sync-outline' as const, label: 'Sync Settings' },
  { icon: 'download-outline' as const, label: 'Export Mental Archive' },
  { icon: 'trash-outline' as const, label: 'Clear Cache' },
];

const PREFERENCES = [
  { icon: 'notifications-outline' as const, label: 'Notifications' },
  { icon: 'color-palette-outline' as const, label: 'Appearance' },
  { icon: 'globe-outline' as const, label: 'Language' },
];

function SettingsGroup({
  title,
  items,
  onItemPress,
}: {
  title: string;
  items: { icon: typeof ACCOUNT[number]['icon']; label: string }[];
  onItemPress?: (label: string) => void;
}) {
  return (
    <View style={styles.group}>
      <AppText variant="labelSm" color={DesignColors.onSurfaceVariant} style={styles.groupTitle}>
        {title}
      </AppText>
      <GlassSurface borderRadius={DesignRadii.xl}>
        {items.map((item, index) => (
          <View key={item.label}>
            <SettingsRow icon={item.icon} label={item.label} onPress={() => onItemPress?.(item.label)} />
            {index < items.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </GlassSurface>
    </View>
  );
}

export default function ProfileScreen() {
  const session = useAuthSession();
  const logout = useAuthStore((state) => state.logout);
  const [avatarUri, setAvatarUri] = useState(DEFAULT_AVATAR);

  const handleEditPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader />

        <View style={styles.profile}>
          <Pressable onPress={handleEditPhoto} style={styles.avatarWrap}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color={DesignColors.onPrimary} />
            </View>
          </Pressable>
          <AppText variant="headlineMd">{session?.firstName ?? 'Guest'}</AppText>
        </View>

        <SettingsGroup title="Account Settings" items={ACCOUNT} />
        <SettingsGroup title="Data Management" items={DATA} />
        <SettingsGroup title="App Preferences" items={PREFERENCES} />
        <SettingsGroup
          title="Session"
          items={[{ icon: 'log-out-outline' as const, label: 'Sign Out' }]}
          onItemPress={(label) => {
            if (label === 'Sign Out') {
              logout();
              router.replace('/login');
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },
  content: {
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingBottom: 24,
    gap: 24,
  },
  profile: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  avatarWrap: {
    marginBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: DesignColors.surfaceContainer,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DesignColors.primary,
    borderWidth: 2,
    borderColor: DesignColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    gap: 10,
  },
  groupTitle: {
    textTransform: 'uppercase',
    paddingLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: DesignColors.outlineVariant,
    marginHorizontal: 16,
  },
});
