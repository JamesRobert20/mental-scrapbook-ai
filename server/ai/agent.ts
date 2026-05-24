import { InferAgentUIMessage, ToolLoopAgent } from 'ai';

import { agentTools } from '@/lib/ai/tools';
import { requireEnv } from '@/server/env';

import { SYSTEM_PROMPT } from './prompts';

const DEFAULT_MODEL = 'google/gemini-3-flash';

export function createChatAgent() {
  requireEnv('AI_GATEWAY_API_KEY');
  return new ToolLoopAgent({
    model: DEFAULT_MODEL,
    instructions: SYSTEM_PROMPT,
    tools: agentTools,
  });
}

export type ChatAgent = ReturnType<typeof createChatAgent>;
export type ChatAgentUIMessage = InferAgentUIMessage<ChatAgent>;
