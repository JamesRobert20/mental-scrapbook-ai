import { StyleSheet, View } from 'react-native'

import Text from '@/components/ui/text'
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme'

type Props = {
    title: string
    children: React.ReactNode
}

export default function SettingsSection({ title, children }: Props) {
    return (
        <View style={styles.wrap}>
            <Text variant="label" muted style={styles.title}>
                {title}
            </Text>
            <View style={styles.card}>{children}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        marginBottom: Spacing.lg
    },
    title: {
        marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.xs
    },
    card: {
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.lg,
        borderCurve: 'continuous',
        overflow: 'hidden',
        boxShadow: Shadows.ambient
    }
})
