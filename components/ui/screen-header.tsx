import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/typography/app-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors, spacing } from '@/constants/design-tokens';

type ScreenHeaderProps = {
  showBack?: boolean;
  onBack?: () => void;
};

export function ScreenHeader({ showBack, onBack }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.unit }]}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable onPress={onBack} hitSlop={12}>
            <IconSymbol name="chevron.left" size={22} color={colors.onSurface} />
          </Pressable>
        ) : null}
      </View>
      <AppText variant="headlineSm" italic style={styles.title}>
        Mental Scrapbook
      </AppText>
      <View style={styles.side}>
        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPaddingMobile,
    paddingBottom: spacing.unit,
  },
  side: {
    width: 32,
    alignItems: 'center',
  },
  spacer: {
    width: 22,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
});
