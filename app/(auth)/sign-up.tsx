import { Link, router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native'

import CaptureOrb from '@/components/capture/capture-orb'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Text from '@/components/ui/text'
import { useSignUp } from '@/hooks/mutations/use-sign-up'
import { useT } from '@/lib/i18n/t'
import { Routes } from '@/lib/navigation/routes'
import { Colors, Radii, Spacing } from '@/constants/theme'

export default function SignUpScreen() {
    const signUp = useSignUp()
    const t = useT()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = () => {
        signUp.mutate(
            { firstName, lastName, email, password },
            { onSuccess: () => router.replace(Routes.home) }
        )
    }

    return (
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
            <ScrollView
                contentContainerStyle={styles.scroll}
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
            >
                <Text variant="headline" style={styles.brand}>
                    Murmur
                </Text>
                <View style={styles.card}>
                    <View style={styles.orbScale}>
                        <CaptureOrb />
                    </View>
                    <Text variant="headline" style={styles.welcome}>
                        {t('auth.createAccount')}
                    </Text>
                    <View style={styles.form}>
                        <View style={styles.nameRow}>
                            <View style={styles.nameField}>
                                <Input
                                    label={t('auth.firstName')}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Jane"
                                />
                            </View>
                            <View style={styles.nameField}>
                                <Input
                                    label={t('auth.lastName')}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Doe"
                                />
                            </View>
                        </View>
                        <Input
                            label={t('auth.email')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                        />
                        <Input
                            label={t('auth.password')}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholder="********"
                        />
                        {signUp.error ? (
                            <Text variant="bodySmall" style={styles.error}>
                                {signUp.error.message}
                            </Text>
                        ) : null}
                        <Button
                            label={
                                signUp.isPending
                                    ? t('auth.creatingAccount')
                                    : t('auth.createAccount')
                            }
                            onPress={handleSignUp}
                            disabled={signUp.isPending}
                        />
                    </View>
                    <Text variant="bodySmall" muted style={styles.footer}>
                        {t('auth.hasAccount')}{' '}
                        <Link href={Routes.signIn}>
                            <Text variant="bodySmall">{t('auth.signIn')}</Text>
                        </Link>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.light.background },
    scroll: {
        flexGrow: 1,
        padding: Spacing.screenPadding,
        paddingTop: Spacing.xxl
    },
    brand: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: Spacing.lg
    },
    card: {
        backgroundColor: Colors.light.surface,
        borderRadius: Radii.xl,
        borderCurve: 'continuous',
        padding: Spacing.lg,
        gap: Spacing.md
    },
    orbScale: {
        transform: [{ scale: 0.55 }],
        marginVertical: -Spacing.xl
    },
    welcome: {
        textAlign: 'center'
    },
    form: {
        gap: Spacing.md
    },
    nameRow: {
        flexDirection: 'row',
        gap: Spacing.md
    },
    nameField: {
        flex: 1
    },
    error: {
        color: Colors.light.error
    },
    footer: {
        textAlign: 'center'
    }
})
