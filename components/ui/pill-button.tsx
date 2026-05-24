import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { DesignColors, DesignRadii } from '@/constants/design';

type PillButtonProps = {
  label: string;
  onPress?: () => void;
  showArrow?: boolean;
  variant?: 'primary' | 'secondary';
};

export function PillButton({
  label,
  onPress,
  showArrow = false,
  variant = 'primary',
}: PillButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}>
      <AppText
        variant="labelMd"
        color={isPrimary ? DesignColors.onPrimary : DesignColors.onSurface}
        style={styles.label}>
        {label}
      </AppText>
      {showArrow ? (
        <View style={styles.arrowWrap}>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={isPrimary ? DesignColors.onPrimary : DesignColors.onSurface}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: DesignRadii.full,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primary: {
    backgroundColor: DesignColors.primary,
  },
  secondary: {
    backgroundColor: DesignColors.glass,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    textTransform: 'uppercase',
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
