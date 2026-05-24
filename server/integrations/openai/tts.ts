import { requireEnv } from '@/server/env';

export type SpeechVoice =
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';

export type SpeechModel = 'tts-1' | 'tts-1-hd';

export type SynthesizeSpeechInput = {
  text: string;
  voice?: SpeechVoice;
  model?: SpeechModel;
};

// AI Gateway doesn't proxy audio synthesis; OpenAI direct.
export async function synthesizeSpeech(
  input: SynthesizeSpeechInput,
): Promise<{ audio: ArrayBuffer; contentType: string }> {
  const apiKey = requireEnv('OPENAI_API_KEY');

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: input.model ?? 'tts-1',
      voice: input.voice ?? 'nova',
      input: input.text,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Speech synthesis failed (${response.status}): ${message}`);
  }

  return {
    audio: await response.arrayBuffer(),
    contentType: 'audio/mpeg',
  };
}
