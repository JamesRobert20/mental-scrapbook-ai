import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/text';
import type { ChatAgentUIMessage } from '@/lib/ai/chat-types';
import { Colors, Spacing } from '@/constants/theme';

type Props = {
  messages: ChatAgentUIMessage[];
};

function messageText(message: ChatAgentUIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

export default function TranscriptStream({ messages }: Props) {
  const visible = messages.filter((m) => messageText(m).length > 0);
  if (visible.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {visible.map((message) => (
        <View
          key={message.id}
          style={[styles.bubble, message.role === 'user' ? styles.user : styles.assistant]}>
          <Text variant="body" selectable style={message.role === 'user' ? styles.userText : undefined}>
            {messageText(message)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
  },
  bubble: {
    padding: Spacing.md,
    borderRadius: 16,
    borderCurve: 'continuous',
    maxWidth: '92%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.outline,
  },
  userText: {
    color: Colors.light.onPrimary,
  },
});
