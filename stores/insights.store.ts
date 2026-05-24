import { create } from 'zustand'

import { todayDayKey } from '@/lib/infrastructure/date-keys'

type InsightsState = {
    selectedDayKey: string
}

const insightsStore = create<InsightsState>(() => ({
    selectedDayKey: todayDayKey()
}))

const { setState, getState } = insightsStore

export const useInsightsSelectedDayKey = () => insightsStore(s => s.selectedDayKey)

export function setInsightsSelectedDayKey(dayKey: string) {
    setState({ selectedDayKey: dayKey })
}

export function resetInsightsSelectedDay() {
    setState({ selectedDayKey: todayDayKey() })
}

export function getInsightsSelectedDayKey(): string {
    return getState().selectedDayKey
}
