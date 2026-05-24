import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { DesignColors, DesignFonts, DesignRadii } from '@/constants/design';

const ERROR_COLOR = '#D32F2F';

type TextFieldProps = TextInputProps & {
  label: string;
  rightLabel?: string;
  onRightLabelPress?: () => void;
  required?: boolean;
  error?: string;
};

export function TextField({
  label,
  rightLabel,
  onRightLabelPress,
  required = false,
  error,
  style,
  ...props
}: TextFieldProps) {
  const showError = Boolean(error);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>
          {label.toUpperCase()}
          {required ? <Text style={styles.requiredStar}> *</Text> : null}
        </Text>
        {rightLabel ? (
          <Pressable onPress={onRightLabelPress}>
            <AppText variant="labelSm" color={DesignColors.onSurfaceVariant}>
              {rightLabel}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <TextInput
        {...props}
        placeholderTextColor={DesignColors.outline}
        style={[styles.input, showError && styles.inputError, style]}
      />
      {showError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontFamily: DesignFonts.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: DesignColors.onSurfaceVariant,
  },
  requiredStar: {
    color: ERROR_COLOR,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  input: {
    minHeight: 52,
    borderRadius: DesignRadii.lg,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    backgroundColor: DesignColors.surfaceContainerLowest,
    paddingHorizontal: 16,
    fontFamily: DesignFonts.sans,
    fontSize: 16,
    color: DesignColors.onSurface,
  },
  inputError: {
    borderColor: ERROR_COLOR,
    borderWidth: 1.5,
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 6,
  },
});
