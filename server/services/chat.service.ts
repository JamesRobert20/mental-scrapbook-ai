import { createAgentUIStreamResponse } from 'ai';
import { z } from 'zod';

import { createChatAgent } from '@/server/ai/agent';

const requestSchema = z.object({
  messages: z.array(z.unknown()),
});

export async function handleChatRequest(request: Request): Promise<Response> {
  const body = await request.json();
  const { messages } = requestSchema.parse(body);
  const agent = createChatAgent();
  return createAgentUIStreamResponse({ agent, uiMessages: messages });
}
