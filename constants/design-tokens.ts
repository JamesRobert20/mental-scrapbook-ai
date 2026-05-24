export const colors = {
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
  surfaceTint: '#5f5e5b',
  primary: '#181916',
  onPrimary: '#ffffff',
  primaryContainer: '#2d2d2a',
  onPrimaryContainer: '#969490',
  inversePrimary: '#c8c6c2',
  secondary: '#536252',
  onSecondary: '#ffffff',
  secondaryContainer: '#d4e4d0',
  onSecondaryContainer: '#586756',
  tertiary: '#16152f',
  onTertiary: '#ffffff',
  tertiaryContainer: '#2b2a45',
  onTertiaryContainer: '#9391b1',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#faf9f7',
  onBackground: '#1a1c1b',
  surfaceVariant: '#e3e2e0',
  accentSage: '#98a895',
  accentLavender: '#a7a5c6',
  accentBlue: '#9bb2c0',
} as const;

export const spacing = {
  unit: 8,
  containerPaddingMobile: 24,
  elementGap: 24,
  sectionGap: 64,
} as const;

export const radii = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontFamilies = {
  display: 'PlayfairDisplay_600SemiBold',
  displayMedium: 'PlayfairDisplay_500Medium',
  displayRegular: 'PlayfairDisplay_400Regular',
  body: 'HankenGrotesk_400Regular',
  bodyMedium: 'HankenGrotesk_500Medium',
  bodySemiBold: 'HankenGrotesk_600SemiBold',
} as const;

export const typography = {
  displayLg: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    lineHeight: 43,
    letterSpacing: -0.72,
  },
  headlineMd: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 32,
    lineHeight: 42,
  },
  headlineSm: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 24,
    lineHeight: 34,
  },
  bodyLg: {
    fontFamily: fontFamilies.body,
    fontSize: 18,
    lineHeight: 29,
  },
  bodyMd: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 26,
  },
  labelMd: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.7,
  },
  labelSm: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.24,
  },
} as const;
