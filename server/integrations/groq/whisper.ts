import { requireEnv } from '@/server/env'

type TranscriptionResult = {
    text: string
}

export async function transcribeAudio(
    audio: Blob,
    options: { language?: string } = {}
): Promise<TranscriptionResult> {
    const apiKey = requireEnv('GROQ_API_KEY')

    const form = new FormData()
    form.append('file', audio, 'audio.m4a')
    form.append('model', 'whisper-large-v3-turbo')
    if (options.language) {
        form.append('language', options.language)
    }

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Groq transcription failed (${response.status}): ${message}`)
    }

    const data = (await response.json()) as { text: string }
    return { text: data.text }
}
