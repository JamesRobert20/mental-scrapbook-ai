import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { DesignColors, DesignRadii } from '@/constants/design';

type ScreenHeaderProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  centerTitle?: boolean;
  italicTitle?: boolean;
  tone?: 'light' | 'inverse';
};

export function ScreenHeader({
  title = 'Mental Scrapbook',
  showBack = false,
  onBack,
  centerTitle = true,
  italicTitle = false,
  tone = 'light',
}: ScreenHeaderProps) {
  const foreground = tone === 'inverse' ? DesignColors.onPrimary : DesignColors.onSurface;

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={foreground} />
          </Pressable>
        ) : null}
      </View>

      <AppText
        variant="headlineSm"
        color={foreground}
        style={[
          styles.title,
          centerTitle && styles.centerTitle,
          italicTitle && styles.italicTitle,
        ]}>
        {title}
      </AppText>

      <View style={[styles.side, styles.sideRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
  },
  centerTitle: {
    textAlign: 'center',
  },
  italicTitle: {
    fontStyle: 'italic',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: DesignRadii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
