import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii } from '@/constants/design-tokens';

type GlassCardProps = ViewProps & {
  accent?: 'sage' | 'lavender' | 'blue';
  noPadding?: boolean;
};

const accentColors = {
  sage: colors.accentSage,
  lavender: colors.accentLavender,
  blue: colors.accentBlue,
};

export function GlassCard({ accent, noPadding, style, children, ...props }: GlassCardProps) {
  const content = (
    <>
      {accent ? <View style={[styles.accentWash, { backgroundColor: accentColors[accent] }]} /> : null}
      {children}
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.card, styles.webGlass, style]} {...props}>
        {content}
      </View>
    );
  }

  return (
    <View style={[styles.card, style]} {...props}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      <View style={noPadding ? undefined : styles.cardContent}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: colors.accentLavender,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 40,
    elevation: 2,
  },
  webGlass: {
    backdropFilter: 'blur(20px)' as unknown as undefined,
  },
  cardContent: {
    padding: 24,
  },
  accentWash: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 2,
    borderRadius: radii.full,
    opacity: 0.6,
  },
});
