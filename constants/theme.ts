export const Colors = {
  light: {
    background: '#faf9f7',
    surface: '#ffffff',
    surfaceContainer: '#efeeec',
    surfaceContainerHigh: '#e9e8e6',
    onBackground: '#1a1c1b',
    onSurface: '#1a1c1b',
    onSurfaceVariant: '#474741',
    outline: '#c8c7bf',
    outlineStrong: '#777770',
    primary: '#181916',
    onPrimary: '#ffffff',
    primaryContainer: '#2d2d2a',
    inverseSurface: '#2f3130',
    inverseOnSurface: '#f1f1ef',
    error: '#ba1a1a',
    accentSage: '#98a895',
    accentLavender: '#a7a5c6',
    accentBlue: '#9bb2c0',
    glass: 'rgba(255, 255, 255, 0.7)',
    tabInactive: '#777770',
    tabActive: '#181916',
    signUpHero: '#000000',
    signUpCard: '#dadad8',
  },
} as const;

export const Spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 24,
} as const;

export const Radii = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
} as const;

export const Typography = {
  display: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  headline: {
    fontFamily: 'PlayfairDisplay_500Medium',
    fontSize: 24,
    lineHeight: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_500Medium',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    lineHeight: 26,
  },
  bodySmall: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: 'HankenGrotesk_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export const Shadows = {
  ambient: '0 12px 40px rgba(20, 20, 20, 0.04)',
  orb: '0 24px 64px rgba(155, 178, 192, 0.25)',
} as const;
