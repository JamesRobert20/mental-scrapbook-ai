import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import Text from '@/components/ui/text';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export default function Input({ label, error, style, secureTextEntry, ...rest }: Props) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = Boolean(secureTextEntry);
  const hideText = isPassword && !revealed;

  return (
    <View style={styles.wrap}>
      <Text variant="label" muted style={styles.label}>
        {label}
      </Text>
      <View style={styles.fieldRow}>
        <TextInput
          placeholderTextColor={Colors.light.onSurfaceVariant}
          secureTextEntry={hideText}
          autoCapitalize={isPassword ? 'none' : rest.autoCapitalize}
          autoCorrect={isPassword ? false : rest.autoCorrect}
          style={[styles.input, isPassword && styles.inputWithToggle, style]}
          {...rest}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setRevealed((r) => !r)}
            hitSlop={8}
            style={styles.revealButton}
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            accessibilityRole="button">
            <Ionicons
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.light.onSurfaceVariant}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="bodySmall" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  label: {
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 13,
  },
  fieldRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    ...Typography.body,
    color: Colors.light.onBackground,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: Radii.md,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputWithToggle: {
    paddingRight: Spacing.xl + Spacing.md,
  },
  revealButton: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
  },
  error: {
    color: Colors.light.error,
  },
});
