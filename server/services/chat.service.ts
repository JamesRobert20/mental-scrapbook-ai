import { createAgentUIStreamResponse } from 'ai'
import { z } from 'zod'

import { isLanguageId, type LanguageId } from '@/lib/i18n/languages'
import { createChatAgent } from '@/server/ai/agent'

const requestSchema = z.object({
    messages: z.array(z.unknown()),
    language: z.string().optional()
})

export async function handleChatRequest(request: Request): Promise<Response> {
    const body = await request.json()
    const { messages, language } = requestSchema.parse(body)
    const resolved: LanguageId | undefined = isLanguageId(language) ? language : undefined
    const agent = createChatAgent(resolved)
    return createAgentUIStreamResponse({ agent, uiMessages: messages })
}
