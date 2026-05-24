export const SPEECH_VOICES = [
    { id: 'nova', label: 'Nova', description: 'Warm, friendly — the default' },
    { id: 'shimmer', label: 'Shimmer', description: 'Soft, calm — good for journaling' },
    { id: 'alloy', label: 'Alloy', description: 'Balanced, neutral' },
    { id: 'echo', label: 'Echo', description: 'Crisp, conversational' },
    { id: 'fable', label: 'Fable', description: 'Storytelling, expressive' },
    { id: 'onyx', label: 'Onyx', description: 'Deep, grounded' }
] as const

export type SpeechVoiceId = (typeof SPEECH_VOICES)[number]['id']

export const DEFAULT_SPEECH_VOICE: SpeechVoiceId = 'nova'
