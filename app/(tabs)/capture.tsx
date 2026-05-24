import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/typography/app-text';
import { PulseBlob } from '@/components/ui/pulse-blob';
import { ScreenHeader } from '@/components/ui/screen-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors, radii, spacing } from '@/constants/design-tokens';

export default function CaptureScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom + 88 }]}>
      <ScreenHeader />
      <View style={styles.center}>
        <PulseBlob size={220} />
      </View>
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Type or just start speaking..."
            placeholderTextColor={colors.onPrimaryContainer}
            style={styles.input}
          />
          <IconSymbol name="mic.fill" size={22} color={colors.onSurfaceVariant} />
        </View>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant} style={styles.status}>
          Your mind is clear.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: spacing.unit,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.unit,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    color: colors.onSurface,
  },
  status: {
    textAlign: 'center',
  },
});
