import {
  AudioQuality,
  IOSOutputFormat,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  type RecordingOptions,
} from 'expo-audio';

import { setCaptureAudioUri } from '@/stores/capture.store';

// 16kHz mono is the native rate Whisper uses internally; recording at this rate
// keeps uploads ~4x smaller than the HIGH_QUALITY preset (44.1kHz stereo) with
// no accuracy loss for speech.
const SPEECH_RECORDING: RecordingOptions = {
  extension: '.m4a',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 48000,
  android: {
    extension: '.m4a',
    outputFormat: 'mpeg4',
    audioEncoder: 'aac',
  },
  ios: {
    extension: '.m4a',
    outputFormat: IOSOutputFormat.MPEG4AAC,
    audioQuality: AudioQuality.MEDIUM,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 48000,
  },
};

export function useRecorder() {
  const recorder = useAudioRecorder(SPEECH_RECORDING);

  async function startRecording() {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Microphone permission is required');
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  async function stopRecording(): Promise<string | null> {
    await recorder.stop();
    // Flip back so subsequent TTS playback routes to the loud speaker on iOS,
    // not the earpiece (the playAndRecord session's default).
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    const uri = recorder.uri;
    if (uri) {
      setCaptureAudioUri(uri);
    }
    return uri;
  }

  return { recorder, startRecording, stopRecording };
}
