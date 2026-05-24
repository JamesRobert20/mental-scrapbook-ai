import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import MicButton from '@/components/capture/mic-button';
import Text from '@/components/ui/text';
import { Colors, Radii, Spacing } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onMicPressIn: () => void;
  onMicPressOut: () => void;
  onSubmit?: () => void;
  statusMessage?: string;
  disabled?: boolean;
  recording?: boolean;
};

export default function VoiceInputBar({
  value,
  onChangeText,
  onMicPressIn,
  onMicPressOut,
  onSubmit,
  statusMessage = 'Your mind is clear.',
  disabled = false,
  recording = false,
}: Props) {
  const hasText = value.trim().length > 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Type or hold the mic..."
            placeholderTextColor={Colors.light.onSurfaceVariant}
            style={styles.input}
            multiline
            editable={!disabled}
            blurOnSubmit
          />
          {hasText ? (
            <Pressable
              onPress={onSubmit}
              disabled={disabled}
              accessibilityLabel="Send message"
              style={({ pressed }) => [styles.sendButton, pressed && styles.sendPressed]}>
              <Ionicons name="arrow-up" size={18} color={Colors.light.onPrimary} />
            </Pressable>
          ) : null}
        </View>
        <MicButton
          active={recording}
          disabled={disabled}
          onPressIn={onMicPressIn}
          onPressOut={onMicPressOut}
        />
      </View>
      <Text variant="bodySmall" muted style={styles.status}>
        {statusMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: Radii.lg,
    borderCurve: 'continuous',
    backgroundColor: Colors.light.surface,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    minHeight: 52,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingVertical: Spacing.sm,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    color: Colors.light.onBackground,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: {
    opacity: 0.85,
  },
  status: {
    textAlign: 'center',
  },
});
