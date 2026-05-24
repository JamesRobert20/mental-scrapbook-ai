import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Text from '@/components/ui/text'
import { dismissBanner, useActiveBanner, type BannerTone } from '@/stores/banner.store'
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme'

const AUTO_DISMISS_MS = 6000

const TONE_ICON: Record<BannerTone, keyof typeof Ionicons.glyphMap> = {
    info: 'sparkles-outline',
    important: 'alert-circle-outline',
    reminder: 'time-outline'
}

const TONE_ACCENT: Record<BannerTone, string> = {
    info: Colors.light.accentBlue,
    important: Colors.light.error,
    reminder: Colors.light.accentLavender
}

export default function NotificationBanner() {
    const banner = useActiveBanner()
    const insets = useSafeAreaInsets()

    useEffect(() => {
        if (!banner) return
        const handle = setTimeout(() => dismissBanner(banner.id), AUTO_DISMISS_MS)
        return () => clearTimeout(handle)
    }, [banner])

    if (!banner) return null

    const accent = TONE_ACCENT[banner.tone]

    return (
        <Animated.View
            pointerEvents="box-none"
            style={[styles.wrap, { paddingTop: insets.top + Spacing.sm }]}
            layout={LinearTransition.duration(180)}
        >
            <Animated.View
                entering={FadeInUp.duration(220)}
                exiting={FadeOutUp.duration(180)}
                style={styles.card}
            >
                <Pressable
                    onPress={() => dismissBanner(banner.id)}
                    style={styles.row}
                    accessibilityLabel="Dismiss notification"
                >
                    <View style={[styles.iconBubble, { backgroundColor: `${accent}22` }]}>
                        <Ionicons
                            name={TONE_ICON[banner.tone]}
                            size={18}
                            color={accent}
                        />
                    </View>
                    <View style={styles.body}>
                        <Text variant="body" style={styles.title} numberOfLines={1}>
                            {banner.title}
                        </Text>
                        {banner.body ? (
                            <Text variant="bodySmall" muted numberOfLines={2}>
                                {banner.body}
                            </Text>
                        ) : null}
                    </View>
                    <Ionicons
                        name="close"
                        size={18}
                        color={Colors.light.onSurfaceVariant}
                    />
                </Pressable>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.screenPadding,
        zIndex: 50
    },
    card: {
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: Colors.light.outline,
        boxShadow: Shadows.ambient
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md
    },
    iconBubble: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: {
        flex: 1,
        gap: 2
    },
    title: {
        fontFamily: 'HankenGrotesk_600SemiBold'
    }
})
