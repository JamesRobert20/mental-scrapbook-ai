import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/typography/app-text';
import { colors, radii, spacing } from '@/constants/design-tokens';

type AppInputProps = TextInputProps & {
  label: string;
  labelRight?: string;
  onLabelRightPress?: () => void;
};

export function AppInput({ label, labelRight, style, ...props }: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <AppText variant="labelMd" color={colors.onSurfaceVariant}>
          {label}
        </AppText>
        {labelRight ? (
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            {labelRight}
          </AppText>
        ) : null}
      </View>
      <TextInput
        placeholderTextColor={colors.onPrimaryContainer}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.unit,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
