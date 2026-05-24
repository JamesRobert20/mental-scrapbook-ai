import { requireEnv } from '@/server/env'

export type SpeechVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

export type SpeechModel = 'tts-1' | 'tts-1-hd'

export type SynthesizeSpeechInput = {
    text: string
    voice?: SpeechVoice
    model?: SpeechModel
}

export type SynthesizedSpeech = {
    body: ReadableStream<Uint8Array> | null
    contentType: string
}

// AI Gateway doesn't proxy audio synthesis; OpenAI direct.
// Returns the upstream body as a stream so the route can pipe it through to the client
// without buffering the entire mp3 — saves ~300-500ms of perceived latency.
export async function synthesizeSpeech(
    input: SynthesizeSpeechInput
): Promise<SynthesizedSpeech> {
    const apiKey = requireEnv('OPENAI_API_KEY')

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: input.model ?? 'tts-1',
            voice: input.voice ?? 'nova',
            input: input.text,
            response_format: 'mp3'
        })
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Speech synthesis failed (${response.status}): ${message}`)
    }

    return { body: response.body, contentType: 'audio/mpeg' }
}
