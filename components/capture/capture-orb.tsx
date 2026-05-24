import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated'

const ORB_SIZE = 220

export default function CaptureOrb() {
    const floatY = useSharedValue(0)
    const rotate = useSharedValue(0)

    useEffect(() => {
        floatY.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
                withTiming(10, { duration: 2400, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        )
        rotate.value = withRepeat(
            withTiming(360, { duration: 18000, easing: Easing.linear }),
            -1,
            false
        )
    }, [floatY, rotate])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY.value }, { rotate: `${rotate.value}deg` }]
    }))

    return (
        <View style={styles.stage}>
            <Animated.View style={[styles.orbWrap, animatedStyle]}>
                <LinearGradient
                    colors={['#d4e8f5', '#c8f0e4', '#e2dff8', '#b8d4e8']}
                    start={{ x: 0.1, y: 0.2 }}
                    end={{ x: 0.9, y: 0.8 }}
                    style={styles.orb}
                >
                    <BlurView
                        intensity={40}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.highlight} />
                    <View style={styles.highlightSecondary} />
                </LinearGradient>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    stage: {
        alignItems: 'center',
        justifyContent: 'center',
        height: ORB_SIZE + 48
    },
    orbWrap: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: ORB_SIZE / 2,
        overflow: 'hidden'
    },
    orb: {
        flex: 1,
        borderRadius: ORB_SIZE / 2,
        overflow: 'hidden'
    },
    highlight: {
        position: 'absolute',
        top: 24,
        left: 32,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.45)'
    },
    highlightSecondary: {
        position: 'absolute',
        bottom: 40,
        right: 28,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)'
    }
})
