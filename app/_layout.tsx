import '@/lib/infrastructure/polyfills'

import {
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold
} from '@expo-google-fonts/playfair-display'
import {
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold
} from '@expo-google-fonts/hanken-grotesk'
import { setAudioModeAsync } from 'expo-audio'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import NotificationBanner from '@/components/ui/notification-banner'
import Text from '@/components/ui/text'
import { useAuthBootstrap } from '@/hooks/use-auth-bootstrap'
import QueryProvider from '@/lib/providers/query-provider'
import { useAuthStatus } from '@/stores/auth.store'
import { Colors } from '@/constants/theme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        PlayfairDisplay_500Medium,
        PlayfairDisplay_600SemiBold,
        HankenGrotesk_400Regular,
        HankenGrotesk_500Medium,
        HankenGrotesk_600SemiBold
    })

    useAuthBootstrap()
    const authStatus = useAuthStatus()

    useEffect(() => {
        if (fontsLoaded && authStatus !== 'bootstrapping') {
            void SplashScreen.hideAsync()
        }
    }, [fontsLoaded, authStatus])

    useEffect(() => {
        // Default to playback-only so TTS plays through the loud speaker on iOS.
        // The recorder flips allowsRecording: true only while the mic is held.
        void setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false })
    }, [])

    if (!fontsLoaded || authStatus === 'bootstrapping') {
        return (
            <View style={styles.splash}>
                <Text variant="display">Murmur</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={styles.root}>
            <QueryProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: Colors.light.background }
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(app)" />
                </Stack>
                <NotificationBanner />
                <StatusBar style="dark" />
            </QueryProvider>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    splash: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.background
    }
})
