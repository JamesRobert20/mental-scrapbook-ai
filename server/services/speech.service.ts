import { z } from 'zod';

import { synthesizeSpeech } from '@/server/integrations/openai/tts';

const requestSchema = z.object({
  text: z.string().min(1).max(4000),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional(),
});

export async function handleSpeakRequest(request: Request): Promise<Response> {
  const body = await request.json();
  const input = requestSchema.parse(body);

  const { audio, contentType } = await synthesizeSpeech(input);

  return new Response(audio, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    },
  });
}
