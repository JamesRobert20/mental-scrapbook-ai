import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/typography/app-text';
import { colors, radii, spacing } from '@/constants/design-tokens';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'glass';
  showArrow?: boolean;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  showArrow,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.glass,
        pressed && styles.pressed,
      ]}>
      <AppText
        variant="labelMd"
        color={isPrimary ? colors.onPrimary : colors.onSurface}
        style={styles.label}>
        {label}
      </AppText>
      {showArrow ? (
        <AppText variant="bodyMd" color={isPrimary ? colors.onPrimary : colors.onSurface}>
          →
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.unit,
    paddingVertical: 16,
    paddingHorizontal: spacing.containerPaddingMobile,
    borderRadius: radii.full,
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
