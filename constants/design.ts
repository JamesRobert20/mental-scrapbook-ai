export const DesignColors = {
  surface: '#faf9f7',
  surfaceDim: '#dadad8',
  surfaceBright: '#faf9f7',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f3f1',
  surfaceContainer: '#efeeec',
  surfaceContainerHigh: '#e9e8e6',
  surfaceContainerHighest: '#e3e2e0',
  onSurface: '#1a1c1b',
  onSurfaceVariant: '#474741',
  inverseSurface: '#2f3130',
  inverseOnSurface: '#f1f1ef',
  outline: '#777770',
  outlineVariant: '#c8c7bf',
  primary: '#181916',
  onPrimary: '#ffffff',
  primaryContainer: '#2d2d2a',
  onPrimaryContainer: '#969490',
  secondary: '#536252',
  onSecondary: '#ffffff',
  secondaryContainer: '#d4e4d0',
  tertiary: '#16152f',
  tertiaryContainer: '#2b2a45',
  error: '#ba1a1a',
  background: '#faf9f7',
  onBackground: '#1a1c1b',
  accentSage: '#98a895',
  accentLavender: '#a7a5c6',
  accentBlue: '#9bb2c0',
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.35)',
} as const;

export const DesignSpacing = {
  unit: 8,
  containerPaddingMobile: 24,
  elementGap: 24,
  sectionGap: 64,
} as const;

export const DesignRadii = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const DesignFonts = {
  serif: 'PlayfairDisplay_500Medium',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  sans: 'HankenGrotesk_400Regular',
  sansMedium: 'HankenGrotesk_500Medium',
  sansSemiBold: 'HankenGrotesk_600SemiBold',
} as const;
