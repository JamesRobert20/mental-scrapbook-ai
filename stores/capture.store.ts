import { create } from 'zustand';

type CaptureStatus = 'idle' | 'recording' | 'thinking' | 'speaking';

type CaptureState = {
  status: CaptureStatus;
  transcript: string;
  audioUri: string | null;
};

const captureStore = create<CaptureState>(() => ({
  status: 'idle',
  transcript: '',
  audioUri: null,
}));

const { setState, getState } = captureStore;

export const useCaptureStatus = () => captureStore((s) => s.status);
export const useCaptureTranscript = () => captureStore((s) => s.transcript);
export const useCaptureAudioUri = () => captureStore((s) => s.audioUri);

export function setCaptureStatus(status: CaptureStatus) {
  setState({ status });
}

export function setCaptureTranscript(transcript: string) {
  setState({ transcript });
}

export function appendTranscript(chunk: string) {
  setState({ transcript: getState().transcript + chunk });
}

export function setCaptureAudioUri(audioUri: string | null) {
  setState({ audioUri });
}

export function resetCapture() {
  setState({ status: 'idle', transcript: '', audioUri: null });
}
