import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { useSpeaker } from '@/hooks/use-speaker';
import { SPEECH_VOICES, type SpeechVoiceId } from '@/lib/ai/voices';
import { tap } from '@/lib/infrastructure/haptics';
import { setSpeechVoice, useSpeechVoice } from '@/stores/preferences.store';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

const PREVIEW_TEXT = 'Hi, this is what I sound like. Ready when you are.';

export default function VoiceSettingsScreen() {
  const selected = useSpeechVoice();
  const { speak, stop } = useSpeaker();

  function handleSelect(voice: SpeechVoiceId) {
    tap('selection');
    setSpeechVoice(voice);
  }

  function handlePreview() {
    stop();
    void speak(PREVIEW_TEXT);
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
      <Text variant="body" muted style={styles.intro}>
        Pick the voice the assistant uses when replying out loud. Falls back to your device voice if
        the network is unavailable.
      </Text>

      <View style={styles.card}>
        {SPEECH_VOICES.map((voice) => {
          const active = voice.id === selected;
          return (
            <Pressable
              key={voice.id}
              onPress={() => handleSelect(voice.id)}
              style={[styles.row, active && styles.rowActive]}>
              <View style={styles.rowText}>
                <Text variant="body">{voice.label}</Text>
                <Text variant="bodySmall" muted>
                  {voice.description}
                </Text>
              </View>
              {active ? (
                <Ionicons name="checkmark-circle" size={22} color={Colors.light.primary} />
              ) : (
                <Ionicons
                  name="ellipse-outline"
                  size={22}
                  color={Colors.light.onSurfaceVariant}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <Button label="Preview voice" variant="ghost" onPress={handlePreview} style={styles.preview} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.screenPadding,
    paddingBottom: 140,
    gap: Spacing.lg,
  },
  intro: {
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: Shadows.ambient,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  rowActive: {
    backgroundColor: Colors.light.surfaceContainer,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  preview: {
    alignSelf: 'stretch',
  },
});
