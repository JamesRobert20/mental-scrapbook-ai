import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/design-tokens';

type PulseBlobProps = {
  size?: number;
};

export function PulseBlob({ size = 200 }: PulseBlobProps) {
  return (
    <View style={[styles.shadow, { width: size, height: size }]}>
      <LinearGradient
        colors={[
          'rgba(167, 165, 198, 0.85)',
          'rgba(155, 178, 192, 0.75)',
          'rgba(152, 168, 149, 0.8)',
        ]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.blob, { width: size, height: size, borderRadius: size / 2 }]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.highlight, { width: size * 0.7, height: size * 0.5, borderRadius: size }]}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.accentLavender,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  blob: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: '8%',
    left: '10%',
    transform: [{ rotate: '-18deg' }],
  },
});
