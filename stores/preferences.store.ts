import { create } from 'zustand'

import { DEFAULT_SPEECH_VOICE, type SpeechVoiceId } from '@/lib/ai/voices'

export const AUTO_SYNC_INTERVAL_OPTIONS = [30, 60, 120, 300] as const
export type AutoSyncIntervalSeconds = (typeof AUTO_SYNC_INTERVAL_OPTIONS)[number]
export const DEFAULT_AUTO_SYNC_INTERVAL: AutoSyncIntervalSeconds = 60

type PreferencesState = {
    speechVoice: SpeechVoiceId
    gmailAutoSyncEnabled: boolean
    gmailAutoSyncIntervalSeconds: AutoSyncIntervalSeconds
    notificationsEnabled: boolean
    reminderLeadMinutes: number
    calendarSyncEnabled: boolean
}

const preferencesStore = create<PreferencesState>(() => ({
    speechVoice: DEFAULT_SPEECH_VOICE,
    gmailAutoSyncEnabled: true,
    gmailAutoSyncIntervalSeconds: DEFAULT_AUTO_SYNC_INTERVAL,
    notificationsEnabled: true,
    reminderLeadMinutes: 10,
    calendarSyncEnabled: false
}))

const { setState, getState } = preferencesStore

export const useSpeechVoice = () => preferencesStore(s => s.speechVoice)
export const getSpeechVoice = (): SpeechVoiceId => getState().speechVoice

export function setSpeechVoice(voice: SpeechVoiceId): void {
    setState({ speechVoice: voice })
}

export const useGmailAutoSyncEnabled = () => preferencesStore(s => s.gmailAutoSyncEnabled)

export const useGmailAutoSyncIntervalSeconds = () =>
    preferencesStore(s => s.gmailAutoSyncIntervalSeconds)

export function setGmailAutoSyncEnabled(enabled: boolean): void {
    setState({ gmailAutoSyncEnabled: enabled })
}

export function setGmailAutoSyncIntervalSeconds(seconds: AutoSyncIntervalSeconds): void {
    setState({ gmailAutoSyncIntervalSeconds: seconds })
}

export const useNotificationsEnabled = () => preferencesStore(s => s.notificationsEnabled)

export const useReminderLeadMinutes = () => preferencesStore(s => s.reminderLeadMinutes)

export function setNotificationsEnabled(enabled: boolean): void {
    setState({ notificationsEnabled: enabled })
}

export function setReminderLeadMinutes(minutes: number): void {
    setState({ reminderLeadMinutes: minutes })
}

export const useCalendarSyncEnabled = () => preferencesStore(s => s.calendarSyncEnabled)

export const getCalendarSyncEnabled = (): boolean => getState().calendarSyncEnabled

export function setCalendarSyncEnabled(enabled: boolean): void {
    setState({ calendarSyncEnabled: enabled })
}
