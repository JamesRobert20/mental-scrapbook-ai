import { InferAgentUIMessage, ToolLoopAgent } from 'ai'

import { agentTools } from '@/lib/ai/tools'
import { type LanguageId } from '@/lib/i18n/languages'
import { requireEnv } from '@/server/env'

import { buildSystemPrompt } from './prompts'

const DEFAULT_MODEL = 'google/gemini-3-flash'

export function createChatAgent(language?: LanguageId) {
    requireEnv('AI_GATEWAY_API_KEY')
    return new ToolLoopAgent({
        model: DEFAULT_MODEL,
        instructions: buildSystemPrompt(language),
        tools: agentTools
    })
}

export type ChatAgent = ReturnType<typeof createChatAgent>
export type ChatAgentUIMessage = InferAgentUIMessage<ChatAgent>
