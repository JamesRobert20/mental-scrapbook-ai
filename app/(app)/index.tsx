import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import CaptureOrb from '@/components/capture/capture-orb';
import TranscriptStream from '@/components/capture/transcript-stream';
import VoiceInputBar from '@/components/capture/voice-input-bar';
import ScreenHeader from '@/components/layout/screen-header';
import { useCaptureChat } from '@/hooks/use-capture-chat';
import { useRecorder } from '@/hooks/use-recorder';
import { useSpeaker } from '@/hooks/use-speaker';
import { transcribeAudioFile } from '@/lib/infrastructure/transcribe';
import { setCaptureStatus, useCaptureStatus } from '@/stores/capture.store';
import { Colors, Spacing } from '@/constants/theme';

const STATUS_MESSAGES: Record<string, string> = {
  idle: 'Your mind is clear.',
  recording: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
};

export default function CaptureScreen() {
  const [text, setText] = useState('');
  const status = useCaptureStatus();
  const { speak } = useSpeaker();
  const { startRecording, stopRecording } = useRecorder();

  const { messages, submitText, status: chatStatus } = useCaptureChat({
    onAssistantText: speak,
  });

  const handleSendText = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || chatStatus === 'streaming' || chatStatus === 'submitted') return;

    setText('');
    await submitText(trimmed);
  }, [text, chatStatus, submitText]);

  const handleMicPressIn = useCallback(async () => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCaptureStatus('recording');
      await startRecording();
    } catch {
      setCaptureStatus('idle');
    }
  }, [startRecording]);

  const handleMicPressOut = useCallback(async () => {
    try {
      setCaptureStatus('thinking');
      const uri = await stopRecording();
      if (!uri) {
        setCaptureStatus('idle');
        return;
      }

      const transcript = await transcribeAudioFile(uri);
      if (!transcript) {
        setCaptureStatus('idle');
        return;
      }

      await submitText(transcript);
    } catch {
      setCaptureStatus('idle');
    }
  }, [stopRecording, submitText]);

  const statusMessage =
    chatStatus === 'streaming' || chatStatus === 'submitted'
      ? STATUS_MESSAGES.thinking
      : STATUS_MESSAGES[status];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled">
        <ScreenHeader />
        <CaptureOrb />
        <TranscriptStream messages={messages} />
        <VoiceInputBar
          value={text}
          onChangeText={setText}
          onMicPressIn={handleMicPressIn}
          onMicPressOut={handleMicPressOut}
          onSubmit={handleSendText}
          statusMessage={statusMessage}
          disabled={chatStatus === 'streaming' || chatStatus === 'submitted'}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
});
