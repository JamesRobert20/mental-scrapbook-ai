import { StyleSheet, View } from 'react-native'

import Text from '@/components/ui/text'
import { Colors, Spacing } from '@/constants/theme'

type Props = {
    title: string
    count?: number
}

export default function SectionHeader({ title, count }: Props) {
    return (
        <View style={styles.wrap}>
            <Text variant="title">{title}</Text>
            {typeof count === 'number' && count > 0 ? (
                <View style={styles.badge}>
                    <Text variant="bodySmall" style={styles.badgeText}>
                        {count}
                    </Text>
                </View>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm
    },
    badge: {
        minWidth: 22,
        height: 22,
        paddingHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 11,
        backgroundColor: Colors.light.surfaceContainerHigh
    },
    badgeText: {
        fontFamily: 'HankenGrotesk_500Medium',
        fontSize: 12,
        lineHeight: 14,
        color: Colors.light.onSurfaceVariant
    }
})
