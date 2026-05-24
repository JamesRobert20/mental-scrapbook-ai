import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native'

import { Colors, Typography } from '@/constants/theme'

type Variant =
    | 'display'
    | 'headline'
    | 'title'
    | 'body'
    | 'bodySmall'
    | 'label'
    | 'button'

type Props = RNTextProps & {
    variant?: Variant
    muted?: boolean
}

export default function Text({ variant = 'body', muted, style, ...rest }: Props) {
    return (
        <RNText
            selectable
            style={[styles.base, Typography[variant], muted && styles.muted, style]}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    base: {
        color: Colors.light.onBackground
    },
    muted: {
        color: Colors.light.onSurfaceVariant
    }
})
