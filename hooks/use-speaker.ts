import * as Speech from 'expo-speech';
import { useCallback, useRef } from 'react';

import { setCaptureStatus } from '@/stores/capture.store';

export function useSpeaker() {
  const speakingRef = useRef(false);

  const speak = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || speakingRef.current) return;

    speakingRef.current = true;
    setCaptureStatus('speaking');

    Speech.speak(trimmed, {
      language: 'en',
      rate: 1.0,
      onDone: () => {
        speakingRef.current = false;
        setCaptureStatus('idle');
      },
      onStopped: () => {
        speakingRef.current = false;
        setCaptureStatus('idle');
      },
      onError: () => {
        speakingRef.current = false;
        setCaptureStatus('idle');
      },
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
    speakingRef.current = false;
    setCaptureStatus('idle');
  }, []);

  return { speak, stop };
}
