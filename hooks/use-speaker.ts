import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useRef } from 'react';

import { synthesizeSpeechToFile } from '@/lib/infrastructure/speech';
import { setCaptureStatus } from '@/stores/capture.store';
import { getSpeechVoice } from '@/stores/preferences.store';

type ActivePlayer = ReturnType<typeof createAudioPlayer>;
type QueueItem = { text: string; synth: Promise<string> };

function playUri(uri: string, attach: (p: ActivePlayer) => void): Promise<void> {
  return new Promise((resolve) => {
    const player = createAudioPlayer(uri);
    attach(player);
    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) {
        sub.remove();
        player.remove();
        resolve();
      }
    });
    player.play();
  });
}

function speakWithExpo(text: string): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(text, {
      language: 'en',
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}

export function useSpeaker() {
  const queueRef = useRef<QueueItem[]>([]);
  const playerRef = useRef<ActivePlayer | null>(null);
  const drainingRef = useRef(false);
  const stoppedRef = useRef(false);

  function attachPlayer(player: ActivePlayer) {
    playerRef.current = player;
  }

  async function drain() {
    if (drainingRef.current) return;
    drainingRef.current = true;
    stoppedRef.current = false;
    try {
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });

      while (queueRef.current.length > 0 && !stoppedRef.current) {
        const item = queueRef.current.shift()!;
        try {
          const uri = await item.synth;
          if (stoppedRef.current) break;
          await playUri(uri, attachPlayer);
        } catch (error) {
          console.warn('[speaker] OpenAI TTS chunk failed, falling back:', error);
          if (stoppedRef.current) break;
          await speakWithExpo(item.text);
        }
        if (playerRef.current) playerRef.current = null;
      }
    } finally {
      drainingRef.current = false;
      setCaptureStatus('idle');
    }
  }

  function speak(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setCaptureStatus('speaking');
    queueRef.current.push({
      text: trimmed,
      synth: synthesizeSpeechToFile(trimmed, getSpeechVoice()),
    });
    void drain();
  }

  function stop() {
    stoppedRef.current = true;
    queueRef.current = [];
    Speech.stop();
    playerRef.current?.remove();
    playerRef.current = null;
    setCaptureStatus('idle');
  }

  return { speak, stop };
}
