import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { DesignColors, DesignFonts } from '@/constants/design';

type TextVariant =
  | 'displayLg'
  | 'headlineMd'
  | 'headlineSm'
  | 'bodyLg'
  | 'bodyMd'
  | 'labelMd'
  | 'labelSm';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
};

const variantStyles: Record<TextVariant, TextStyle> = {
  displayLg: {
    fontFamily: DesignFonts.serifSemiBold,
    fontSize: 36,
    lineHeight: 43,
    letterSpacing: -0.72,
  },
  headlineMd: {
    fontFamily: DesignFonts.serif,
    fontSize: 32,
    lineHeight: 42,
  },
  headlineSm: {
    fontFamily: DesignFonts.serif,
    fontSize: 24,
    lineHeight: 34,
  },
  bodyLg: {
    fontFamily: DesignFonts.sans,
    fontSize: 18,
    lineHeight: 29,
  },
  bodyMd: {
    fontFamily: DesignFonts.sans,
    fontSize: 16,
    lineHeight: 26,
  },
  labelMd: {
    fontFamily: DesignFonts.sansMedium,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.7,
  },
  labelSm: {
    fontFamily: DesignFonts.sansSemiBold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.24,
  },
};

export function AppText({
  variant = 'bodyMd',
  color = DesignColors.onSurface,
  style,
  ...props
}: AppTextProps) {
  return <Text {...props} style={[variantStyles[variant], { color }, style]} />;
}

export const appTextStyles = StyleSheet.create(variantStyles);
