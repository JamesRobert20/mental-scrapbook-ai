import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Text from '@/components/ui/text';
import { tap } from '@/lib/infrastructure/haptics';
import { Colors, Radii, Spacing } from '@/constants/theme';

const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  insights: { label: 'Insights', icon: 'bulb-outline' },
  index: { label: 'Capture', icon: 'mic-outline' },
  profile: { label: 'Profile', icon: 'person-outline' },
};

export default function PillTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter(
    (route) => descriptors[route.key]?.options.href !== null && TAB_CONFIG[route.name],
  );

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      <View style={styles.pill}>
        {visibleRoutes.map((route) => {
          const focused = state.routes[state.index]?.key === route.key;
          const config = TAB_CONFIG[route.name]!;

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                if (!focused) tap('selection');
                navigation.navigate(route.name);
              }}
              style={[styles.tab, focused && styles.tabActive]}>
              <Ionicons
                name={config.icon}
                size={22}
                color={focused ? Colors.light.onPrimary : Colors.light.tabInactive}
              />
              <Text
                variant="bodySmall"
                style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: Spacing.screenPadding,
    right: Spacing.screenPadding,
    bottom: 0,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.pill,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  label: {
    fontSize: 12,
  },
  labelActive: {
    color: Colors.light.onPrimary,
    fontFamily: 'HankenGrotesk_600SemiBold',
  },
  labelInactive: {
    color: Colors.light.tabInactive,
  },
});
