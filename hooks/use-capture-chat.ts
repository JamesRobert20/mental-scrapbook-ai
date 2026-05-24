import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type ChatAddToolOutputFunction,
} from 'ai';
import { useQueryClient } from '@tanstack/react-query';
import { fetch as expoFetch } from 'expo/fetch';
import { useCallback, useEffect, useRef } from 'react';

import type { ChatAgentUIMessage } from '@/lib/ai/chat-types';
import { agentTools } from '@/lib/ai/tools';
import { apiUrl } from '@/lib/infrastructure/api-url';

type AgentToolName = keyof typeof agentTools;
import { syncGmailTodos } from '@/lib/services/gmail.service';
import {
  completeTodoForCurrentUser,
  createTodoForCurrentUser,
  listTodosForCurrentUser,
} from '@/lib/services/todos.service';
import type { CreateTodoInput } from '@/lib/z/todo';
import { setCaptureStatus } from '@/stores/capture.store';

type UseCaptureChatOptions = {
  onAssistantText?: (text: string) => void;
};

export function useCaptureChat(options: UseCaptureChatOptions = {}) {
  const queryClient = useQueryClient();
  const addToolOutputRef = useRef<ChatAddToolOutputFunction<ChatAgentUIMessage> | null>(null);

  const executeTool = useCallback(
    async (toolCall: { toolName: string; input: unknown }) => {
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
    },
    [queryClient],
  );

  const chat = useChat<ChatAgentUIMessage>({
    transport: new DefaultChatTransport({
      api: apiUrl('/api/chat'),
      fetch: expoFetch as unknown as typeof globalThis.fetch,
    }),
    onToolCall: async ({ toolCall }) => {
      const addToolOutput = addToolOutputRef.current;
      if (!addToolOutput) return;

      try {
        const output = await executeTool(toolCall);
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
        options.onAssistantText?.(text);
      }
    },
    onError: () => {
      setCaptureStatus('idle');
    },
  });

  useEffect(() => {
    addToolOutputRef.current = chat.addToolOutput;
  }, [chat.addToolOutput]);

  const submitText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setCaptureStatus('thinking');
      await chat.sendMessage({ text: trimmed });
    },
    [chat],
  );

  return { ...chat, submitText };
}
