import { useChat } from '@ai-sdk/react'
import {
    DefaultChatTransport,
    lastAssistantMessageIsCompleteWithToolCalls,
    type ChatAddToolOutputFunction
} from 'ai'
import { useQueryClient } from '@tanstack/react-query'
import { fetch as expoFetch } from 'expo/fetch'
import { useEffect, useRef } from 'react'

import type { ChatAgentUIMessage } from '@/lib/ai/chat-types'
import { agentTools } from '@/lib/ai/tools'
import { apiUrl } from '@/lib/infrastructure/api-url'
import { tap } from '@/lib/infrastructure/haptics'
import { extractSentences } from '@/lib/infrastructure/sentence-stream'
import { syncGmailTodos } from '@/lib/services/gmail.service'
import {
    completeTodoForCurrentUser,
    createTodoForCurrentUser,
    listTodosForCurrentUser
} from '@/lib/services/todos.service'
import type { CreateTodoInput } from '@/lib/z/todo'
import { setCaptureStatus } from '@/stores/capture.store'

type AgentToolName = keyof typeof agentTools

type UseCaptureChatOptions = {
    onAssistantSentence?: (sentence: string) => void
}

function messageText(message: ChatAgentUIMessage): string {
    return message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('\n')
}

async function executeTool(
    queryClient: ReturnType<typeof useQueryClient>,
    toolCall: { toolName: string; input: unknown }
) {
    switch (toolCall.toolName) {
        case 'createTodo': {
            const input = toolCall.input as Omit<CreateTodoInput, 'source'>
            const todo = await createTodoForCurrentUser({ ...input, source: 'voice' })
            await queryClient.invalidateQueries({ queryKey: ['todos'] })
            return todo
        }
        case 'completeTodo': {
            const { id } = toolCall.input as { id: string }
            await completeTodoForCurrentUser(id)
            await queryClient.invalidateQueries({ queryKey: ['todos'] })
            return { success: true }
        }
        case 'listTodos': {
            return listTodosForCurrentUser()
        }
        case 'pullGmailTodos': {
            const { since } = (toolCall.input ?? {}) as { since?: string }
            return syncGmailTodos({ since })
        }
        default:
            throw new Error(`Unknown tool: ${toolCall.toolName}`)
    }
}

export function useCaptureChat(options: UseCaptureChatOptions = {}) {
    const queryClient = useQueryClient()
    const addToolOutputRef = useRef<ChatAddToolOutputFunction<ChatAgentUIMessage> | null>(
        null
    )
    const onAssistantSentenceRef = useRef(options.onAssistantSentence)
    onAssistantSentenceRef.current = options.onAssistantSentence
    const lastEmittedRef = useRef<{ messageId: string; consumed: number }>({
        messageId: '',
        consumed: 0
    })

    const transportRef = useRef<DefaultChatTransport<ChatAgentUIMessage> | null>(null)
    if (!transportRef.current) {
        transportRef.current = new DefaultChatTransport({
            api: apiUrl('/api/chat'),
            fetch: expoFetch as unknown as typeof globalThis.fetch
        })
    }

    const chat = useChat<ChatAgentUIMessage>({
        transport: transportRef.current,
        onToolCall: async ({ toolCall }) => {
            const addToolOutput = addToolOutputRef.current
            if (!addToolOutput) return

            try {
                const output = await executeTool(queryClient, toolCall)
                addToolOutput({
                    tool: toolCall.toolName as AgentToolName,
                    toolCallId: toolCall.toolCallId,
                    output: output as never
                })
            } catch (err) {
                addToolOutput({
                    tool: toolCall.toolName as AgentToolName,
                    toolCallId: toolCall.toolCallId,
                    state: 'output-error',
                    errorText: err instanceof Error ? err.message : 'Tool failed'
                })
            }
        },
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        onFinish: ({ message }) => {
            const text = messageText(message)
            const consumed =
                lastEmittedRef.current.messageId === message.id
                    ? lastEmittedRef.current.consumed
                    : 0
            const tail = text.slice(consumed).trim()
            if (tail) {
                onAssistantSentenceRef.current?.(tail)
                lastEmittedRef.current = { messageId: message.id, consumed: text.length }
            } else if (text.length === 0) {
                setCaptureStatus('idle')
            }
        },
        onError: () => {
            tap('error')
            setCaptureStatus('idle')
        }
    })

    const { sendMessage, messages } = chat

    useEffect(() => {
        addToolOutputRef.current = chat.addToolOutput
    }, [chat.addToolOutput])

    useEffect(() => {
        const last = messages[messages.length - 1]
        if (!last || last.role !== 'assistant') return

        const text = messageText(last)
        if (lastEmittedRef.current.messageId !== last.id) {
            lastEmittedRef.current = { messageId: last.id, consumed: 0 }
        }
        const fresh = text.slice(lastEmittedRef.current.consumed)
        if (!fresh) return

        const { sentences, remainder } = extractSentences(fresh)
        if (sentences.length === 0) return

        for (const sentence of sentences) {
            onAssistantSentenceRef.current?.(sentence)
        }
        lastEmittedRef.current.consumed = text.length - remainder.length
    }, [messages])

    async function submitText(text: string) {
        const trimmed = text.trim()
        if (!trimmed) return
        setCaptureStatus('thinking')
        await sendMessage({ text: trimmed })
    }

    return { ...chat, submitText }
}
