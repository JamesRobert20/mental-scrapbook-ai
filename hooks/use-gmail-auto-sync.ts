import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import {
    ensureNotificationPermission,
    fireLocalNotification
} from '@/lib/infrastructure/notifications'
import {
    runGmailSyncForCurrentUser,
    type GmailSyncRunResult
} from '@/lib/services/gmail.service'
import { useGmailStatus } from '@/hooks/queries/use-gmail-status'
import { pushBanner } from '@/stores/banner.store'
import {
    useGmailAutoSyncEnabled,
    useGmailAutoSyncIntervalSeconds,
    useNotificationsEnabled
} from '@/stores/preferences.store'

const MIN_GAP_MS = 5000

export function useGmailAutoSync(): void {
    const queryClient = useQueryClient()
    const { data: connection } = useGmailStatus()
    const enabled = useGmailAutoSyncEnabled()
    const intervalSeconds = useGmailAutoSyncIntervalSeconds()
    const notificationsEnabled = useNotificationsEnabled()

    const inflightRef = useRef(false)
    const lastRunAtRef = useRef(0)
    const appStateRef = useRef<AppStateStatus>(AppState.currentState)

    const handleResult = useCallback(
        async (result: GmailSyncRunResult) => {
            if (result.created.length === 0) return

            await queryClient.invalidateQueries({ queryKey: ['todos'] })
            await queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] })

            const important = result.created.filter(t => t.priority === 'high')
            const count = result.created.length

            if (important.length > 0) {
                const head = important[0]!
                pushBanner({
                    tone: 'important',
                    title: `New important: ${head.title}`,
                    body:
                        important.length > 1
                            ? `${important.length} important emails turned into todos.`
                            : 'From your Gmail. Tap Insights to review.'
                })
                if (notificationsEnabled) {
                    const granted = await ensureNotificationPermission()
                    if (granted) {
                        await fireLocalNotification({
                            title: 'New important todo from Gmail',
                            body: head.title
                        })
                    }
                }
            } else {
                pushBanner({
                    tone: 'info',
                    title:
                        count === 1
                            ? `New todo from Gmail: ${result.created[0]!.title}`
                            : `${count} new todos from Gmail`,
                    body: 'Open Insights to see them.'
                })
            }
        },
        [notificationsEnabled, queryClient]
    )

    const runSync = useCallback(async () => {
        if (!connection) return
        if (!enabled) return
        if (inflightRef.current) return
        if (Date.now() - lastRunAtRef.current < MIN_GAP_MS) return
        if (appStateRef.current !== 'active') return

        inflightRef.current = true
        lastRunAtRef.current = Date.now()
        try {
            const result = await runGmailSyncForCurrentUser()
            await handleResult(result)
        } catch {
            // network or auth blip; the next tick will retry
        } finally {
            inflightRef.current = false
        }
    }, [connection, enabled, handleResult])

    useEffect(() => {
        if (!connection || !enabled) return

        void runSync()
        const handle = setInterval(() => {
            void runSync()
        }, intervalSeconds * 1000)
        return () => clearInterval(handle)
    }, [connection, enabled, intervalSeconds, runSync])

    useEffect(() => {
        const sub = AppState.addEventListener('change', next => {
            const prev = appStateRef.current
            appStateRef.current = next
            if (prev !== 'active' && next === 'active') {
                void runSync()
            }
        })
        return () => sub.remove()
    }, [runSync])
}
