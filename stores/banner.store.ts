import { create } from 'zustand'

export type BannerTone = 'info' | 'important' | 'reminder'

export type Banner = {
    id: string
    tone: BannerTone
    title: string
    body?: string
}

type BannerState = {
    queue: Banner[]
}

const bannerStore = create<BannerState>(() => ({ queue: [] }))

const { setState, getState } = bannerStore

export const useActiveBanner = () => bannerStore(s => s.queue[0] ?? null)

export function pushBanner(banner: Omit<Banner, 'id'>): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setState({ queue: [...getState().queue, { ...banner, id }] })
}

export function dismissBanner(id?: string): void {
    const queue = getState().queue
    if (queue.length === 0) return
    if (id && queue[0]?.id !== id) return
    setState({ queue: queue.slice(1) })
}

export function clearBanners(): void {
    setState({ queue: [] })
}
