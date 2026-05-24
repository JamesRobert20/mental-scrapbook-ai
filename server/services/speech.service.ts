import { z } from 'zod'

import { synthesizeSpeech } from '@/server/integrations/openai/tts'

const requestSchema = z.object({
    text: z.string().min(1).max(4000),
    voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional()
})

export async function handleSpeakRequest(request: Request): Promise<Response> {
    const payload = await request.json()
    const input = requestSchema.parse(payload)

    const { body, contentType } = await synthesizeSpeech(input)

    return new Response(body, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-store'
        }
    })
}
