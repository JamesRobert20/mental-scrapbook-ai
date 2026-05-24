import { InferAgentUIMessage, ToolLoopAgent } from 'ai';

import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { agentTools } from '@/lib/ai/tools';

// Type-only — never executed on the client. Just feeds InferAgentUIMessage.
const typeAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: SYSTEM_PROMPT,
  tools: agentTools,
});

export type ChatAgentUIMessage = InferAgentUIMessage<typeof typeAgent>;
