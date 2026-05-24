import { apiUrl } from '@/lib/infrastructure/api-url'
import { getLanguage } from '@/stores/preferences.store'

export async function transcribeAudioFile(uri: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', {
        uri,
        name: 'recording.m4a',
        type: 'audio/m4a'
    } as unknown as Blob)
    formData.append('language', getLanguage())

    const response = await fetch(apiUrl('/api/transcribe'), {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message || `Transcription failed (${response.status})`)
    }

    const data = (await response.json()) as { text: string }
    return data.text.trim()
}
