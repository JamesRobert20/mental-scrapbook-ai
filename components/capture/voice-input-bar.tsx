import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

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
};

export default function VoiceInputBar({
  value,
  onChangeText,
  onMicPressIn,
  onMicPressOut,
  onSubmit,
  statusMessage = 'Your mind is clear.',
  disabled = false,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Type or just start speaking..."
          placeholderTextColor={Colors.light.onSurfaceVariant}
          style={styles.input}
          multiline
          editable={!disabled}
          onSubmitEditing={onSubmit}
          blurOnSubmit
          returnKeyType="send"
        />
        <Pressable
          onPressIn={disabled ? undefined : onMicPressIn}
          onPressOut={disabled ? undefined : onMicPressOut}
          style={styles.micButton}
          accessibilityLabel="Hold to speak">
          <Ionicons name="mic-outline" size={22} color={Colors.light.onSurfaceVariant} />
        </Pressable>
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
    paddingHorizontal: Spacing.screenPadding,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.outline,
    borderRadius: Radii.md,
    borderCurve: 'continuous',
    backgroundColor: Colors.light.surface,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingVertical: Spacing.md,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    color: Colors.light.onBackground,
  },
  micButton: {
    padding: Spacing.md,
  },
  status: {
    textAlign: 'center',
  },
});
