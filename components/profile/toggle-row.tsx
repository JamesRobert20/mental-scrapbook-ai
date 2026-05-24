import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Switch, View } from 'react-native'

import Text from '@/components/ui/text'
import { tap } from '@/lib/infrastructure/haptics'
import { Colors, Spacing } from '@/constants/theme'

type Props = {
    label: string
    description?: string
    icon?: keyof typeof Ionicons.glyphMap
    value: boolean
    disabled?: boolean
    onValueChange: (next: boolean) => void
}

export default function ToggleRow({
    label,
    description,
    icon,
    value,
    disabled,
    onValueChange
}: Props) {
    const handleChange = (next: boolean) => {
        tap('selection')
        onValueChange(next)
    }

    return (
        <View style={styles.row}>
            {icon ? (
                <Ionicons name={icon} size={20} color={Colors.light.onBackground} />
            ) : null}
            <View style={styles.body}>
                <Text variant="body">{label}</Text>
                {description ? (
                    <Text variant="bodySmall" muted>
                        {description}
                    </Text>
                ) : null}
            </View>
            <Switch
                value={value}
                disabled={disabled}
                onValueChange={handleChange}
                trackColor={{
                    false: Colors.light.surfaceContainerHigh,
                    true: Colors.light.primary
                }}
                thumbColor={Colors.light.onPrimary}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md
    },
    body: {
        flex: 1,
        gap: 2
    }
})
