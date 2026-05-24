import { tool } from 'ai';
import { z } from 'zod';

export const agentTools = {
  createTodo: tool({
    description: 'Create a new todo for the user.',
    inputSchema: z.object({
      title: z.string().min(1),
      notes: z.string().optional(),
      dueAt: z.iso.datetime().optional(),
      priority: z.enum(['low', 'medium', 'high']).default('medium'),
      category: z.enum(['important', 'schedule', 'general']).default('general'),
      timeLabel: z
        .string()
        .optional()
        .describe('Human-friendly time label like "9:00 am" — only for schedule items'),
    }),
  }),

  completeTodo: tool({
    description: 'Mark a todo as completed.',
    inputSchema: z.object({ id: z.string() }),
  }),

  listTodos: tool({
    description: "List the user's open todos, optionally filtered by category.",
    inputSchema: z.object({
      category: z.enum(['important', 'schedule', 'general']).optional(),
    }),
  }),

  pullGmailTodos: tool({
    description:
      'Pull recent Gmail messages and return suggested todos. The user must have connected Gmail in Settings.',
    inputSchema: z.object({
      since: z.iso.datetime().optional(),
    }),
  }),
} as const;
