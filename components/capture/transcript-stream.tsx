import { StyleSheet, View } from 'react-native'

import MarkdownContent from '@/components/capture/markdown-content'
import Text from '@/components/ui/text'
import type { ChatAgentUIMessage } from '@/lib/ai/chat-types'
import { Colors, Radii, Spacing } from '@/constants/theme'

type Props = {
    messages: ChatAgentUIMessage[]
}

function messageText(message: ChatAgentUIMessage): string {
    return message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('\n')
        .trim()
}

export default function TranscriptStream({ messages }: Props) {
    const visible = messages.filter(m => messageText(m).length > 0)
    if (visible.length === 0) {
        return null
    }

    return (
        <View style={styles.wrap}>
            {visible.map(message => {
                const text = messageText(message)
                if (message.role === 'user') {
                    return (
                        <View key={message.id} style={styles.userRow}>
                            <View style={styles.userBubble}>
                                <Text variant="body" selectable style={styles.userText}>
                                    {text}
                                </Text>
                            </View>
                        </View>
                    )
                }

                return (
                    <View key={message.id} style={styles.assistantRow}>
                        <MarkdownContent content={text} />
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        gap: Spacing.lg,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg
    },
    userRow: {
        alignItems: 'flex-end'
    },
    userBubble: {
        maxWidth: '88%',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.light.surfaceContainerHigh,
        borderRadius: Radii.lg,
        borderCurve: 'continuous'
    },
    userText: {
        color: Colors.light.onBackground
    },
    assistantRow: {
        width: '100%'
    }
})
