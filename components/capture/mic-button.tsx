import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

type Props = {
  active?: boolean;
  disabled?: boolean;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const SIZE = 48;
const HALO_EXTRA = 10;
const HALO = SIZE + HALO_EXTRA;

const IDLE_COLORS = ['#d4e8f5', '#e2dff8'] as const;
const ACTIVE_COLORS = ['#ffb59b', '#ff7e6b'] as const;

export default function MicButton({ active, disabled, onPressIn, onPressOut }: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.set(0);
    pulse.set(
      withRepeat(
        withTiming(1, {
          duration: active ? 800 : 2400,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(pulse);
  }, [active, pulse]);

  const haloStyle = useAnimatedStyle(() => {
    const p = pulse.value;
    const scale = 1 + p * (active ? 0.7 : 0.22);
    const opacity = active ? 0.55 - p * 0.4 : 0.22 - p * 0.14;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          haloStyle,
          { backgroundColor: active ? '#ff7e6b' : Colors.light.accentLavender },
        ]}
      />
      <Pressable
        onPressIn={disabled ? undefined : onPressIn}
        onPressOut={disabled ? undefined : onPressOut}
        accessibilityLabel="Hold to speak"
        accessibilityState={{ busy: active, disabled }}
        style={({ pressed }) => [
          styles.buttonShadow,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}>
        <LinearGradient
          colors={active ? ACTIVE_COLORS : IDLE_COLORS}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={styles.gradient}>
          <Ionicons
            name={active ? 'mic' : 'mic-outline'}
            size={22}
            color={active ? '#ffffff' : Colors.light.onBackground}
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    top: -HALO_EXTRA / 2,
    left: -HALO_EXTRA / 2,
  },
  buttonShadow: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(120, 130, 160, 0.25)',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
