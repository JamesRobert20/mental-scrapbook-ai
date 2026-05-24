import Markdown from '@novastera-oss/react-native-markdown-display';
import { Platform, StyleSheet } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@/constants/theme';

type Props = {
  content: string;
};

const codeFont = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const markdownStyles = StyleSheet.create({
  body: {
    color: Colors.light.onBackground,
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  heading1: {
    fontFamily: Typography.headline.fontFamily,
    fontSize: Typography.headline.fontSize,
    lineHeight: Typography.headline.lineHeight,
    color: Colors.light.onBackground,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heading2: {
    fontFamily: Typography.title.fontFamily,
    fontSize: Typography.title.fontSize,
    lineHeight: Typography.title.lineHeight,
    color: Colors.light.onBackground,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  heading3: {
    fontFamily: Typography.title.fontFamily,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.light.onBackground,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: Spacing.sm,
  },
  strong: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontWeight: '600',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: Colors.light.accentBlue,
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: Colors.light.outline,
    height: 1,
    marginVertical: Spacing.md,
  },
  blockquote: {
    backgroundColor: Colors.light.surfaceContainer,
    borderLeftColor: Colors.light.accentSage,
    borderLeftWidth: 3,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: Radii.sm,
  },
  bullet_list: {
    marginBottom: Spacing.sm,
  },
  ordered_list: {
    marginBottom: Spacing.sm,
  },
  list_item: {
    marginBottom: Spacing.xs,
  },
  code_inline: {
    fontFamily: codeFont,
    fontSize: 14,
    backgroundColor: Colors.light.surfaceContainerHigh,
    color: Colors.light.onBackground,
    borderWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  code_block: {
    fontFamily: codeFont,
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: Colors.light.surfaceContainerHigh,
    color: Colors.light.onBackground,
    borderWidth: 0,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginVertical: Spacing.sm,
  },
  fence: {
    fontFamily: codeFont,
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: Colors.light.surfaceContainerHigh,
    color: Colors.light.onBackground,
    borderWidth: 0,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginVertical: Spacing.sm,
  },
});

export default function MarkdownContent({ content }: Props) {
  return (
    <Markdown style={markdownStyles} mergeStyle>
      {content}
    </Markdown>
  );
}
