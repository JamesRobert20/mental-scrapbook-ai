import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography } from '@/constants/design-tokens';

type Variant = keyof typeof typography;

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
  italic?: boolean;
};

export function AppText({
  variant = 'bodyMd',
  color = colors.onSurface,
  italic,
  style,
  ...props
}: AppTextProps) {
  const variantStyle = typography[variant] as TextStyle;

  return (
    <Text
      style={[
        variantStyle,
        { color },
        italic && { fontStyle: 'italic' },
        style,
      ]}
      {...props}
    />
  );
}
