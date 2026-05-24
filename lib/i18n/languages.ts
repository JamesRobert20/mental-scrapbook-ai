// Languages the user can choose for the assistant's reply + voice + STT.
// whisper: ISO-639-1 hint for Groq Whisper; speechLocale: expo-speech fallback.
export const SUPPORTED_LANGUAGES = [
    {
        id: 'en',
        label: 'English',
        nativeLabel: 'English',
        whisper: 'en',
        speechLocale: 'en-US',
        promptLabel: 'English',
        voicePreview: 'Hi, this is what I sound like. Ready when you are.'
    },
    {
        id: 'es',
        label: 'Spanish',
        nativeLabel: 'Español',
        whisper: 'es',
        speechLocale: 'es-ES',
        promptLabel: 'Spanish',
        voicePreview: 'Hola, así sueno. Listo cuando tú lo estés.'
    },
    {
        id: 'fr',
        label: 'French',
        nativeLabel: 'Français',
        whisper: 'fr',
        speechLocale: 'fr-FR',
        promptLabel: 'French',
        voicePreview: 'Bonjour, voici ma voix. Je suis prêt quand vous l’êtes.'
    },
    {
        id: 'de',
        label: 'German',
        nativeLabel: 'Deutsch',
        whisper: 'de',
        speechLocale: 'de-DE',
        promptLabel: 'German',
        voicePreview: 'Hallo, so klinge ich. Bereit, wenn du es bist.'
    },
    {
        id: 'pt',
        label: 'Portuguese',
        nativeLabel: 'Português',
        whisper: 'pt',
        speechLocale: 'pt-BR',
        promptLabel: 'Portuguese',
        voicePreview: 'Olá, é assim que eu soo. Pronto quando você estiver.'
    },
    {
        id: 'it',
        label: 'Italian',
        nativeLabel: 'Italiano',
        whisper: 'it',
        speechLocale: 'it-IT',
        promptLabel: 'Italian',
        voicePreview: 'Ciao, ecco come suono. Pronto quando lo sei tu.'
    },
    {
        id: 'ja',
        label: 'Japanese',
        nativeLabel: '日本語',
        whisper: 'ja',
        speechLocale: 'ja-JP',
        promptLabel: 'Japanese',
        voicePreview: 'こんにちは。これが私の声です。準備ができたらどうぞ。'
    },
    {
        id: 'zh',
        label: 'Chinese',
        nativeLabel: '中文',
        whisper: 'zh',
        speechLocale: 'zh-CN',
        promptLabel: 'Mandarin Chinese',
        voicePreview: '你好，这是我的声音。准备好了就开始吧。'
    }
] as const

export type LanguageId = (typeof SUPPORTED_LANGUAGES)[number]['id']
export type LanguageMeta = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: LanguageId = 'en'

export function getLanguageMeta(id: LanguageId): LanguageMeta {
    return SUPPORTED_LANGUAGES.find(l => l.id === id) ?? SUPPORTED_LANGUAGES[0]
}

export function isLanguageId(value: unknown): value is LanguageId {
    return typeof value === 'string' && SUPPORTED_LANGUAGES.some(l => l.id === value)
}
