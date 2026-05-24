// Thin wrapper around expo-calendar. Owns the "Murmur" calendar so
// our events stay isolated from the user's primary calendar.
import * as Calendar from 'expo-calendar'
import { Platform } from 'react-native'

const CALENDAR_TITLE = 'Murmur'
const CALENDAR_COLOR = '#181916'
const DEFAULT_DURATION_MS = 30 * 60 * 1000

let cachedCalendarId: string | null = null

export async function ensureCalendarPermission(): Promise<boolean> {
    const current = await Calendar.getCalendarPermissionsAsync()
    if (current.status === 'granted') return true
    if (!current.canAskAgain && current.status === 'denied') return false
    const next = await Calendar.requestCalendarPermissionsAsync()
    return next.status === 'granted'
}

async function findExistingCalendar(): Promise<Calendar.Calendar | null> {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
    return (
        calendars.find(
            c => c.title === CALENDAR_TITLE && c.allowsModifications !== false
        ) ?? null
    )
}

async function pickIosSource(): Promise<Calendar.Source | undefined> {
    const sources = await Calendar.getSourcesAsync()
    return (
        sources.find(s => s.type === 'local') ??
        sources.find(s => s.name === 'iCloud') ??
        sources[0]
    )
}

async function createDedicatedCalendar(): Promise<string> {
    if (Platform.OS === 'ios') {
        const source = await pickIosSource()
        if (!source) {
            throw new Error('No calendar source is available on this device')
        }
        return Calendar.createCalendarAsync({
            title: CALENDAR_TITLE,
            color: CALENDAR_COLOR,
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: source.id,
            source,
            name: CALENDAR_TITLE,
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER
        })
    }

    return Calendar.createCalendarAsync({
        title: CALENDAR_TITLE,
        color: CALENDAR_COLOR,
        entityType: Calendar.EntityTypes.EVENT,
        name: CALENDAR_TITLE,
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER
    })
}

export async function getOrCreateMentalScrapbookCalendarId(): Promise<string> {
    if (cachedCalendarId) return cachedCalendarId
    const existing = await findExistingCalendar()
    if (existing) {
        cachedCalendarId = existing.id
        return existing.id
    }
    const created = await createDedicatedCalendar()
    cachedCalendarId = created
    return created
}

export type CreateCalendarEventInput = {
    title: string
    startsAt: Date
    notes?: string | null
    durationMs?: number
}

export async function createCalendarEvent(
    input: CreateCalendarEventInput
): Promise<string> {
    const calendarId = await getOrCreateMentalScrapbookCalendarId()
    const endsAt = new Date(
        input.startsAt.getTime() + (input.durationMs ?? DEFAULT_DURATION_MS)
    )
    return Calendar.createEventAsync(calendarId, {
        title: input.title,
        startDate: input.startsAt,
        endDate: endsAt,
        notes: input.notes ?? undefined,
        timeZone: undefined
    })
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
    try {
        await Calendar.deleteEventAsync(eventId)
    } catch {
        // event may already be gone; best-effort
    }
}

export function resetCalendarCache(): void {
    cachedCalendarId = null
}
