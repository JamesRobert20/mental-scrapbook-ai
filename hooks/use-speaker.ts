import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useRef } from 'react';

import { synthesizeSpeechToFile } from '@/lib/infrastructure/speech';
import { setCaptureStatus } from '@/stores/capture.store';
import { getSpeechVoice } from '@/stores/preferences.store';

type ActivePlayer = ReturnType<typeof createAudioPlayer>;

export function useSpeaker() {
  const playerRef = useRef<ActivePlayer | null>(null);
  const speakingRef = useRef(false);

  function cleanup() {
    playerRef.current?.remove();
    playerRef.current = null;
    speakingRef.current = false;
    setCaptureStatus('idle');
  }

  async function speak(text: string) {
    const trimmed = text.trim();
    if (!trimmed || speakingRef.current) return;

    speakingRef.current = true;
    setCaptureStatus('speaking');

    try {
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
      const uri = await synthesizeSpeechToFile(trimmed, getSpeechVoice());

      const player = createAudioPlayer(uri);
      playerRef.current = player;

      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          subscription.remove();
          cleanup();
        }
      });

      player.play();
    } catch (error) {
      console.warn('[speaker] OpenAI TTS failed, falling back to expo-speech:', error);
      Speech.speak(trimmed, {
        language: 'en',
        onDone: cleanup,
        onStopped: cleanup,
        onError: cleanup,
      });
    }
  }

  function stop() {
    Speech.stop();
    cleanup();
  }

  return { speak, stop };
}
