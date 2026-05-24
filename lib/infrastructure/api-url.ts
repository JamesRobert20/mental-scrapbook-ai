import Constants from 'expo-constants'

// Devices in Expo Go can't resolve "/api/..." — derive the dev host from Metro.
export function apiUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`

    if (process.env.NODE_ENV === 'development') {
        const origin = Constants.experienceUrl?.replace('exp://', 'http://')
        if (origin) return origin + normalized
    }

    const base = process.env.EXPO_PUBLIC_API_BASE_URL
    if (base) return base + normalized

    return normalized
}
