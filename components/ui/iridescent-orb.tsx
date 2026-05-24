import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type IridescentOrbProps = {
  size?: number;
  style?: ViewStyle;
};

export function IridescentOrb({ size = 120, style }: IridescentOrbProps) {
  const shadowSize = size * 0.75;

  return (
    <View style={[styles.wrapper, { width: size, height: size + shadowSize * 0.35 }, style]}>
      <LinearGradient
        colors={['#dfe8f5', '#c9b8e8', '#a8d4e6', '#e8dff5', '#b8c9e8']}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      <LinearGradient
        colors={['rgba(167, 165, 198, 0.35)', 'rgba(155, 178, 192, 0.05)']}
        style={[
          styles.shadow,
          {
            width: shadowSize,
            height: shadowSize * 0.35,
            borderRadius: shadowSize,
            bottom: 0,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  orb: {
    opacity: 0.95,
  },
  shadow: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
