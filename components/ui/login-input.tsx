import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { DesignColors, DesignFonts, DesignRadii } from '@/constants/design';

type LoginInputProps = TextInputProps & {
  label: string;
};

export function LoginInput({ label, style, ...props }: LoginInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        {...props}
        placeholderTextColor={DesignColors.outline}
        style={[styles.input, style]}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        keyboardAppearance="light"
      />
    </View>
  );
}

type LoginPasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
};

export function LoginPasswordInput({
  label,
  value,
  onChangeText,
  onSubmitEditing,
}: LoginPasswordInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder="Enter your password"
        placeholderTextColor={DesignColors.outline}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        autoComplete="off"
        importantForAutofill="no"
        keyboardAppearance="light"
        returnKeyType="done"
        {...Platform.select({
          ios: {
            // Avoids iOS / Expo Go password autofill and settings redirect.
            textContentType: 'oneTimeCode' as const,
            secureTextEntry: true,
            passwordRules: 'required: none;',
          },
          android: {
            textContentType: 'none' as const,
            secureTextEntry: true,
          },
          default: {
            textContentType: 'none' as const,
            secureTextEntry: true,
          },
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontFamily: DesignFonts.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: DesignColors.onSurfaceVariant,
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
});
