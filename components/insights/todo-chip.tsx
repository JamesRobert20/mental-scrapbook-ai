import { StyleSheet, View } from 'react-native'

import Text from '@/components/ui/text'
import { Colors, Radii, Spacing } from '@/constants/theme'

type Props = {
    title: string
}

export default function TodoChip({ title }: Props) {
    return (
        <View style={styles.chip}>
            <View style={styles.dot} />
            <Text variant="bodySmall" selectable numberOfLines={1} style={styles.label}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm + 2,
        paddingVertical: Spacing.sm + 2,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.md,
        borderCurve: 'continuous'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.accentLavender
    },
    label: {
        flex: 1,
        color: Colors.light.onBackground
    }
})
