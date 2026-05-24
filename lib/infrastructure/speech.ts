import { File, Paths } from 'expo-file-system';

import type { SpeechVoiceId } from '@/lib/ai/voices';
import { apiUrl } from '@/lib/infrastructure/api-url';

export async function synthesizeSpeechToFile(
  text: string,
  voice?: SpeechVoiceId,
): Promise<string> {
  const response = await fetch(apiUrl('/api/speak'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Speech request failed (${response.status}): ${message}`);
  }

  const buffer = await response.arrayBuffer();
  const file = new File(Paths.cache, `tts-${Date.now()}.mp3`);
  file.create({ overwrite: true });
  file.write(new Uint8Array(buffer));
  return file.uri;
}
