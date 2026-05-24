import { Ionicons } from '@expo/vector-icons'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import Text from '@/components/ui/text'
import {
    SUPPORTED_LANGUAGES,
    type LanguageId,
    type LanguageMeta
} from '@/lib/i18n/languages'
import { useT } from '@/lib/i18n/t'
import { tap } from '@/lib/infrastructure/haptics'
import { setLanguage, useLanguage } from '@/stores/preferences.store'
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme'

export default function LanguageScreen() {
    const selected = useLanguage()
    const t = useT()

    function handleSelect(id: LanguageId) {
        if (id === selected) return
        tap('selection')
        setLanguage(id)
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
        >
            <Text variant="body" muted style={styles.intro}>
                {t('language.intro')}
            </Text>

            <View style={styles.card}>
                {SUPPORTED_LANGUAGES.map((language: LanguageMeta) => {
                    const active = language.id === selected
                    return (
                        <Pressable
                            key={language.id}
                            onPress={() => handleSelect(language.id)}
                            style={[styles.row, active && styles.rowActive]}
                        >
                            <View style={styles.rowText}>
                                <Text variant="body">{language.label}</Text>
                                <Text variant="bodySmall" muted>
                                    {language.nativeLabel}
                                </Text>
                            </View>
                            <Ionicons
                                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                                size={22}
                                color={
                                    active
                                        ? Colors.light.primary
                                        : Colors.light.onSurfaceVariant
                                }
                            />
                        </Pressable>
                    )
                })}
            </View>

            <Text variant="bodySmall" muted style={styles.footnote}>
                {t('language.footnote')}
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        padding: Spacing.screenPadding,
        paddingBottom: 140,
        gap: Spacing.lg
    },
    intro: {
        marginBottom: Spacing.sm
    },
    card: {
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.lg,
        borderCurve: 'continuous',
        overflow: 'hidden',
        boxShadow: Shadows.ambient
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        gap: Spacing.md
    },
    rowActive: {
        backgroundColor: Colors.light.surfaceContainer
    },
    rowText: {
        flex: 1,
        gap: 2
    },
    footnote: {
        textAlign: 'center'
    }
})
