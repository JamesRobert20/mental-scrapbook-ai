import { requireEnv } from '@/server/env';

type TranscriptionResult = {
  text: string;
};

// AI Gateway does not proxy audio endpoints; hit OpenAI directly.
export async function transcribeAudio(audio: Blob): Promise<TranscriptionResult> {
  const apiKey = requireEnv('OPENAI_API_KEY');

  const form = new FormData();
  form.append('file', audio, 'audio.m4a');
  form.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Whisper transcription failed (${response.status}): ${message}`);
  }

  const data = (await response.json()) as { text: string };
  return { text: data.text };
}
