import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { DesignColors, DesignRadii } from '@/constants/design';

type GlassSurfaceProps = ViewProps & {
  intensity?: number;
  borderRadius?: number;
};

export function GlassSurface({
  children,
  style,
  intensity = 40,
  borderRadius = DesignRadii.xl,
  ...props
}: GlassSurfaceProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        {...props}
        style={[styles.fallback, { borderRadius }, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      {...props}
      intensity={intensity}
      tint="light"
      style={[styles.blur, { borderRadius }, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
    backgroundColor: DesignColors.glass,
    borderWidth: 1,
    borderColor: DesignColors.glassBorder,
  },
  fallback: {
    backgroundColor: DesignColors.glass,
    borderWidth: 1,
    borderColor: DesignColors.glassBorder,
  },
});
