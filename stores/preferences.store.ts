import { create } from 'zustand';

import { DEFAULT_SPEECH_VOICE, type SpeechVoiceId } from '@/lib/ai/voices';

type PreferencesState = {
  speechVoice: SpeechVoiceId;
};

const preferencesStore = create<PreferencesState>(() => ({
  speechVoice: DEFAULT_SPEECH_VOICE,
}));

const { setState, getState } = preferencesStore;

export const useSpeechVoice = () => preferencesStore((s) => s.speechVoice);

export const getSpeechVoice = (): SpeechVoiceId => getState().speechVoice;

export function setSpeechVoice(voice: SpeechVoiceId): void {
  setState({ speechVoice: voice });
}
