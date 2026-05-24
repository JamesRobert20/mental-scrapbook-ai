import { Ionicons } from '@expo/vector-icons'
import { useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Text from '@/components/ui/text'
import { useUpdateProfile } from '@/hooks/mutations/use-update-profile'
import { updateProfileSchema } from '@/lib/z/auth'
import { useAuthUser } from '@/stores/auth.store'
import { Colors, Radii, Spacing } from '@/constants/theme'

function friendlyError(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('email')) {
        if (lower.includes('taken') || lower.includes('already')) {
            return 'Another account already uses this email.'
        }
        if (lower.includes('valid')) return 'Enter a valid email.'
    }
    if (lower.includes('first name')) return 'First name is required.'
    if (lower.includes('last name')) return 'Last name is required.'
    return "We couldn't save your changes. Please try again."
}

export default function PersonalInfoScreen() {
    const user = useAuthUser()
    const update = useUpdateProfile()
    const [firstName, setFirstName] = useState(user?.firstName ?? '')
    const [lastName, setLastName] = useState(user?.lastName ?? '')
    const [email, setEmail] = useState(user?.email ?? '')
    const [error, setError] = useState<string | null>(null)
    const [savedAt, setSavedAt] = useState<number | null>(null)

    useEffect(() => {
        if (!user) return
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setEmail(user.email)
    }, [user])

    const isDirty = useMemo(() => {
        if (!user) return false
        return (
            firstName.trim() !== user.firstName ||
            lastName.trim() !== user.lastName ||
            email.trim().toLowerCase() !== user.email
        )
    }, [user, firstName, lastName, email])

    const handleSave = () => {
        setError(null)
        const parsed = updateProfileSchema.safeParse({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim()
        })
        if (!parsed.success) {
            setError(friendlyError(parsed.error.issues[0]?.message ?? ''))
            return
        }
        update.mutate(parsed.data, {
            onSuccess: () => {
                setSavedAt(Date.now())
                setTimeout(() => setSavedAt(null), 2400)
            },
            onError: err => setError(friendlyError(err.message))
        })
    }

    return (
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
            <ScrollView
                contentContainerStyle={styles.scroll}
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
            >
                <Text variant="body" muted style={styles.intro}>
                    Update how Mental Scrapbook addresses you.
                </Text>

                <Input
                    label="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    returnKeyType="next"
                />
                <Input
                    label="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    returnKeyType="next"
                />
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    returnKeyType="done"
                />

                {error ? (
                    <View style={styles.errorRow}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={18}
                            color={Colors.light.error}
                        />
                        <Text variant="bodySmall" style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                ) : null}

                {savedAt ? (
                    <View style={styles.successRow}>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={18}
                            color={Colors.light.primary}
                        />
                        <Text variant="bodySmall" muted>
                            Saved.
                        </Text>
                    </View>
                ) : null}

                <Button
                    label={update.isPending ? 'Saving…' : 'Save changes'}
                    onPress={handleSave}
                    disabled={!isDirty || update.isPending}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: Colors.light.background
    },
    scroll: {
        padding: Spacing.screenPadding,
        paddingBottom: 140,
        gap: Spacing.md
    },
    intro: {
        marginBottom: Spacing.sm
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        backgroundColor: 'rgba(186, 26, 26, 0.06)',
        borderRadius: Radii.md,
        borderCurve: 'continuous',
        padding: Spacing.md
    },
    errorText: {
        flex: 1,
        color: Colors.light.error
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm
    }
})
