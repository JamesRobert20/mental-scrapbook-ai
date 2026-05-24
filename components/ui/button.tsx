import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Radii, Spacing } from '@/constants/theme';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export default function Button({ label, variant = 'primary', style, disabled, ...rest }: Props) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}>
      <Text variant="button" style={variant === 'primary' ? styles.primaryLabel : styles.ghostLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.pill,
    borderCurve: 'continuous',
  },
  primary: {
    backgroundColor: Colors.light.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.outline,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryLabel: {
    color: Colors.light.onPrimary,
  },
  ghostLabel: {
    color: Colors.light.onBackground,
  },
});
