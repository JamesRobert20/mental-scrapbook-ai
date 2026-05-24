import { InferAgentUIMessage, ToolLoopAgent } from 'ai'

import { agentTools } from '@/lib/ai/tools'

const typeAgent = new ToolLoopAgent({
    model: 'anthropic/claude-sonnet-4.5',
    instructions: '',
    tools: agentTools
})

export type ChatAgentUIMessage = InferAgentUIMessage<typeof typeAgent>
