import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';

import { setCaptureAudioUri } from '@/stores/capture.store';

export function useRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  async function startRecording() {
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
  }

  async function stopRecording(): Promise<string | null> {
    await recorder.stop();
    const uri = recorder.uri;
    if (uri) {
      setCaptureAudioUri(uri);
    }
    return uri;
  }

  return { recorder, startRecording, stopRecording };
}
