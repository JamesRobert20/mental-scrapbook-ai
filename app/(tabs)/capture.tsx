import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IridescentOrb } from '@/components/ui/iridescent-orb';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignColors, DesignFonts, DesignRadii, DesignSpacing } from '@/constants/design';

export default function CaptureScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <ScreenHeader />

        <View style={styles.centerStage}>
          <IridescentOrb size={180} />
          <AppText variant="bodyMd" color={DesignColors.onSurfaceVariant} style={styles.status}>
            Your mind is clear.
          </AppText>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            placeholder="Type or just start speaking..."
            placeholderTextColor={DesignColors.outline}
            style={styles.input}
          />
          <View style={styles.micButton}>
            <Ionicons name="mic-outline" size={20} color={DesignColors.onSurfaceVariant} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: DesignSpacing.containerPaddingMobile,
    paddingBottom: 24,
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  status: {
    marginTop: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: DesignRadii.full,
    backgroundColor: DesignColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: DesignColors.outlineVariant,
    paddingLeft: 20,
    paddingRight: 8,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontFamily: DesignFonts.sans,
    fontSize: 16,
    color: DesignColors.onSurface,
    paddingVertical: 14,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
