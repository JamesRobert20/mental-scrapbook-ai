import { Link, router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native'

import CaptureOrb from '@/components/capture/capture-orb'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Text from '@/components/ui/text'
import { useSignIn } from '@/hooks/mutations/use-sign-in'
import { Routes } from '@/lib/navigation/routes'
import { Colors, Radii, Spacing } from '@/constants/theme'

export default function SignInScreen() {
    const signIn = useSignIn()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = () => {
        signIn.mutate(
            { email, password },
            {
                onSuccess: () => router.replace(Routes.home)
            }
        )
    }

    return (
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
            <ScrollView
                contentContainerStyle={styles.scroll}
                contentInsetAdjustmentBehavior="automatic"
            >
                <Text variant="headline" style={styles.brand}>
                    Mental Scrapbook
                </Text>
                <View style={styles.card}>
                    <View style={styles.orbScale}>
                        <CaptureOrb />
                    </View>
                    <Text variant="headline" style={styles.welcome}>
                        Welcome back
                    </Text>
                    <View style={styles.form}>
                        <Input
                            label="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                        />
                        <Input
                            label="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholder="********"
                        />
                        {signIn.error ? (
                            <Text variant="bodySmall" style={styles.error}>
                                {signIn.error.message}
                            </Text>
                        ) : null}
                        <Button
                            label={signIn.isPending ? 'Signing in…' : 'Sign in'}
                            onPress={handleSignIn}
                            disabled={signIn.isPending}
                        />
                    </View>
                    <Text variant="bodySmall" muted style={styles.footer}>
                        Don&apos;t have an account?{' '}
                        <Link href={Routes.signUp}>
                            <Text variant="bodySmall">Sign Up</Text>
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
    error: {
        color: Colors.light.error
    },
    footer: {
        textAlign: 'center'
    }
})
