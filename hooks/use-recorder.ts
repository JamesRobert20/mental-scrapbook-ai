import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useCallback } from 'react';

import { setCaptureAudioUri } from '@/stores/capture.store';

export function useRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const startRecording = useCallback(async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Microphone permission is required');
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [recorder]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    await recorder.stop();
    const uri = recorder.uri;
    if (uri) {
      setCaptureAudioUri(uri);
    }
    return uri;
  }, [recorder]);

  return { recorder, startRecording, stopRecording };
}
