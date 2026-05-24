import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CaptureOrb from '@/components/capture/capture-orb';
import TranscriptStream from '@/components/capture/transcript-stream';
import VoiceInputBar from '@/components/capture/voice-input-bar';
import ScreenHeader from '@/components/layout/screen-header';
import { useCaptureChat } from '@/hooks/use-capture-chat';
import { useRecorder } from '@/hooks/use-recorder';
import { useSpeaker } from '@/hooks/use-speaker';
import { tap } from '@/lib/infrastructure/haptics';
import { transcribeAudioFile } from '@/lib/infrastructure/transcribe';
import { setCaptureStatus, useCaptureStatus } from '@/stores/capture.store';
import { Colors, Spacing } from '@/constants/theme';

const STATUS_MESSAGES: Record<string, string> = {
  idle: 'Your mind is clear.',
  recording: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
};

const TAB_BAR_OFFSET = 96;

export default function CaptureScreen() {
  const [text, setText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const status = useCaptureStatus();
  const insets = useSafeAreaInsets();
  const { speak } = useSpeaker();
  const { startRecording, stopRecording } = useRecorder();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const { messages, submitText, status: chatStatus } = useCaptureChat({
    onAssistantText: speak,
  });

  async function handleSendText() {
    const trimmed = text.trim();
    if (!trimmed || chatStatus === 'streaming' || chatStatus === 'submitted') return;

    tap('light');
    setText('');
    await submitText(trimmed);
  }

  async function handleMicPressIn() {
    try {
      tap('medium');
      setCaptureStatus('recording');
      await startRecording();
    } catch {
      tap('error');
      setCaptureStatus('idle');
    }
  }

  async function handleMicPressOut() {
    try {
      tap('light');
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
      tap('error');
      setCaptureStatus('idle');
    }
  }

  const statusMessage =
    chatStatus === 'streaming' || chatStatus === 'submitted'
      ? STATUS_MESSAGES.thinking
      : STATUS_MESSAGES[status];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : insets.top}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <ScreenHeader />
        <CaptureOrb />
        <TranscriptStream messages={messages} />
      </ScrollView>
      <View
        style={[
          styles.dock,
          { paddingBottom: keyboardVisible ? Spacing.sm : insets.bottom + TAB_BAR_OFFSET },
        ]}>
        <VoiceInputBar
          value={text}
          onChangeText={setText}
          onMicPressIn={handleMicPressIn}
          onMicPressOut={handleMicPressOut}
          onSubmit={handleSendText}
          statusMessage={statusMessage}
          disabled={chatStatus === 'streaming' || chatStatus === 'submitted'}
          recording={status === 'recording'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: Spacing.md,
  },
  dock: {
    paddingTop: Spacing.sm,
    backgroundColor: Colors.light.background,
  },
});
