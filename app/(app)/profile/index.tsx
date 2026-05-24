import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native'

import ScreenHeader from '@/components/layout/screen-header'
import SettingsRow from '@/components/profile/settings-row'
import SettingsSection from '@/components/profile/settings-section'
import Text from '@/components/ui/text'
import { useUpdateAvatar } from '@/hooks/mutations/use-update-avatar'
import { tap } from '@/lib/infrastructure/haptics'
import { Routes } from '@/lib/navigation/routes'
import { signOut } from '@/lib/services/auth.service'
import { setAuthUnauthenticated, useAuthUser } from '@/stores/auth.store'
import { Colors, Spacing } from '@/constants/theme'

export default function ProfileScreen() {
    const user = useAuthUser()
    const displayName = user ? user.firstName : 'Guest'
    const updateAvatar = useUpdateAvatar()
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [avatarError, setAvatarError] = useState<string | null>(null)

    const handleSignOut = async () => {
        if (isSigningOut) return
        setIsSigningOut(true)
        try {
            await signOut()
            setAuthUnauthenticated()
            router.replace(Routes.signIn)
        } finally {
            setIsSigningOut(false)
        }
    }

    const handlePickAvatar = async () => {
        if (updateAvatar.isPending) return
        tap('selection')
        setAvatarError(null)

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permission.granted) {
            setAvatarError('Allow photo access to change your picture.')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85
        })

        if (result.canceled || !result.assets[0]) return

        try {
            await updateAvatar.mutateAsync(result.assets[0].uri)
        } catch {
            setAvatarError("We couldn't save that picture. Please try again.")
        }
    }

    return (
        <View style={styles.root}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                contentInsetAdjustmentBehavior="automatic"
            >
                <ScreenHeader />
                <View style={styles.profile}>
                    <Pressable
                        onPress={handlePickAvatar}
                        disabled={updateAvatar.isPending}
                        style={styles.avatarPressable}
                        accessibilityRole="button"
                        accessibilityLabel="Change profile picture"
                    >
                        <View style={styles.avatar}>
                            {user?.avatarUri ? (
                                <Image
                                    source={{ uri: user.avatarUri }}
                                    style={styles.avatarImage}
                                    contentFit="cover"
                                    transition={120}
                                />
                            ) : (
                                <Text variant="headline" style={styles.avatarText}>
                                    {displayName.charAt(0)}
                                </Text>
                            )}
                            {updateAvatar.isPending ? (
                                <View style={styles.avatarOverlay}>
                                    <ActivityIndicator color={Colors.light.onPrimary} />
                                </View>
                            ) : null}
                        </View>
                        <View style={styles.pencilBubble}>
                            <Ionicons
                                name="pencil"
                                size={14}
                                color={Colors.light.onPrimary}
                            />
                        </View>
                    </Pressable>
                    <Text variant="headline">{displayName}</Text>
                    {avatarError ? (
                        <Text variant="bodySmall" style={styles.avatarError}>
                            {avatarError}
                        </Text>
                    ) : null}
                </View>

                <SettingsSection title="Account">
                    <SettingsRow
                        label="Personal Information"
                        icon="person-outline"
                        onPress={() => router.push(Routes.settings.personalInfo)}
                    />
                </SettingsSection>

                <SettingsSection title="Preferences">
                    <SettingsRow
                        label="Notifications"
                        icon="notifications-outline"
                        onPress={() => router.push(Routes.settings.notifications)}
                    />
                    <SettingsRow
                        label="Language"
                        icon="globe-outline"
                        onPress={() => router.push(Routes.settings.language)}
                    />
                    <SettingsRow
                        label="Voice"
                        icon="mic-circle-outline"
                        onPress={() => router.push(Routes.settings.voice)}
                    />
                    <SettingsRow
                        label="Sync Gmail"
                        icon="sync-outline"
                        onPress={() => router.push(Routes.settings.syncGmail)}
                    />
                    <SettingsRow
                        label="Calendar"
                        icon="calendar-outline"
                        onPress={() => router.push(Routes.settings.calendar)}
                    />
                </SettingsSection>

                <SettingsSection title="Developer">
                    <SettingsRow
                        label="Export database"
                        icon="code-slash-outline"
                        onPress={() => router.push(Routes.settings.developer)}
                    />
                </SettingsSection>

                <SettingsSection title="Session">
                    <SettingsRow
                        label={isSigningOut ? 'Signing out…' : 'Sign Out'}
                        icon="log-out-outline"
                        onPress={handleSignOut}
                        destructive
                        showChevron={false}
                        disabled={isSigningOut}
                        trailing={
                            isSigningOut ? (
                                <ActivityIndicator
                                    color={Colors.light.error}
                                    size="small"
                                />
                            ) : null
                        }
                    />
                </SettingsSection>
            </ScrollView>
        </View>
    )
}

const AVATAR_SIZE = 96

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.light.background
    },
    scroll: {
        paddingHorizontal: Spacing.screenPadding,
        paddingBottom: 120
    },
    profile: {
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xl
    },
    avatarPressable: {
        position: 'relative',
        marginBottom: Spacing.sm
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: Colors.light.surfaceContainerHigh,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    avatarImage: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE
    },
    avatarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 20, 20, 0.45)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {
        fontSize: 36
    },
    pencilBubble: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.light.background
    },
    avatarError: {
        color: Colors.light.error,
        textAlign: 'center',
        marginTop: Spacing.xs
    }
})
