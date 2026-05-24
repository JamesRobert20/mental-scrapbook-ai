import { BlurView } from 'expo-blur'
import { StyleSheet, View, type ViewProps } from 'react-native'

import { Colors, Radii, Shadows } from '@/constants/theme'

type Props = ViewProps & {
    children: React.ReactNode
}

export default function GlassPane({ children, style, ...rest }: Props) {
    return (
        <View style={[styles.wrap, style]} {...rest}>
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
            <View style={styles.content}>{children}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        overflow: 'hidden',
        borderRadius: Radii.lg,
        borderCurve: 'continuous',
        backgroundColor: Colors.light.glass,
        boxShadow: Shadows.ambient
    },
    content: {
        padding: 16
    }
})
