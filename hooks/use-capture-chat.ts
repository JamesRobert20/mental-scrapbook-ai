import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type ChatAddToolOutputFunction,
} from 'ai';
import { useQueryClient } from '@tanstack/react-query';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useRef } from 'react';

import type { ChatAgentUIMessage } from '@/lib/ai/chat-types';
import { agentTools } from '@/lib/ai/tools';
import { apiUrl } from '@/lib/infrastructure/api-url';
import { tap } from '@/lib/infrastructure/haptics';
import { syncGmailTodos } from '@/lib/services/gmail.service';
import {
  completeTodoForCurrentUser,
  createTodoForCurrentUser,
  listTodosForCurrentUser,
} from '@/lib/services/todos.service';
import type { CreateTodoInput } from '@/lib/z/todo';
import { setCaptureStatus } from '@/stores/capture.store';

type AgentToolName = keyof typeof agentTools;

type UseCaptureChatOptions = {
  onAssistantText?: (text: string) => void;
};

async function executeTool(
  queryClient: ReturnType<typeof useQueryClient>,
  toolCall: { toolName: string; input: unknown },
) {
  switch (toolCall.toolName) {
    case 'createTodo': {
      const input = toolCall.input as Omit<CreateTodoInput, 'source'>;
      const todo = await createTodoForCurrentUser({ ...input, source: 'voice' });
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
      return todo;
    }
    case 'completeTodo': {
      const { id } = toolCall.input as { id: string };
      await completeTodoForCurrentUser(id);
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
      return { success: true };
    }
    case 'listTodos': {
      const { category } = (toolCall.input ?? {}) as {
        category?: 'important' | 'schedule' | 'general';
      };
      return listTodosForCurrentUser(category);
    }
    case 'pullGmailTodos': {
      const { since } = (toolCall.input ?? {}) as { since?: string };
      return syncGmailTodos({ since });
    }
    default:
      throw new Error(`Unknown tool: ${toolCall.toolName}`);
  }
}

export function useCaptureChat(options: UseCaptureChatOptions = {}) {
  const queryClient = useQueryClient();
  const addToolOutputRef = useRef<ChatAddToolOutputFunction<ChatAgentUIMessage> | null>(null);
  const onAssistantTextRef = useRef(options.onAssistantText);
  onAssistantTextRef.current = options.onAssistantText;

  const transportRef = useRef<DefaultChatTransport<ChatAgentUIMessage> | null>(null);
  if (!transportRef.current) {
    transportRef.current = new DefaultChatTransport({
      api: apiUrl('/api/chat'),
      fetch: expoFetch as unknown as typeof globalThis.fetch,
    });
  }

  const chat = useChat<ChatAgentUIMessage>({
    transport: transportRef.current,
    onToolCall: async ({ toolCall }) => {
      const addToolOutput = addToolOutputRef.current;
      if (!addToolOutput) return;

      try {
        const output = await executeTool(queryClient, toolCall);
        addToolOutput({
          tool: toolCall.toolName as AgentToolName,
          toolCallId: toolCall.toolCallId,
          output: output as never,
        });
      } catch (err) {
        addToolOutput({
          tool: toolCall.toolName as AgentToolName,
          toolCallId: toolCall.toolCallId,
          state: 'output-error',
          errorText: err instanceof Error ? err.message : 'Tool failed',
        });
      }
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: ({ message }) => {
      setCaptureStatus('idle');
      const text = message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')
        .trim();
      if (text) {
        onAssistantTextRef.current?.(text);
      }
    },
    onError: () => {
      tap('error');
      setCaptureStatus('idle');
    },
  });

  const { sendMessage } = chat;

  useEffect(() => {
    addToolOutputRef.current = chat.addToolOutput;
  }, [chat.addToolOutput]);

  async function submitText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setCaptureStatus('thinking');
    await sendMessage({ text: trimmed });
  }

  return { ...chat, submitText };
}
