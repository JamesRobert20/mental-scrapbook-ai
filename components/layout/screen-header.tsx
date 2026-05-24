import { StyleSheet, View } from 'react-native'

import Text from '@/components/ui/text'
import { Spacing } from '@/constants/theme'

export default function ScreenHeader() {
    return (
        <View style={styles.wrap}>
            <Text variant="display" style={styles.title}>
                Murmur
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md
    },
    title: {
        textAlign: 'center',
        fontSize: 28
    }
})
