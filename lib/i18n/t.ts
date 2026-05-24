import { useLanguage } from '@/stores/preferences.store'

import { DEFAULT_LANGUAGE, type LanguageId } from './languages'
import { STRINGS, type StringKey } from './strings'

export function t(key: StringKey, language: LanguageId = DEFAULT_LANGUAGE): string {
    const entry = STRINGS[key]
    return entry[language] ?? entry[DEFAULT_LANGUAGE]
}

export function useT(): (key: StringKey) => string {
    const language = useLanguage()
    return (key: StringKey) => t(key, language)
}
