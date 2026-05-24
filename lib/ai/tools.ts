import { tool } from 'ai'
import { z } from 'zod'

export const agentTools = {
    createTodo: tool({
        description:
            'Create a todo for the user. Set priority "high" only for genuinely urgent or important tasks. Set dueAt (full ISO datetime including the time the user mentioned) for anything tied to a specific time of day.',
        inputSchema: z.object({
            title: z
                .string()
                .min(1)
                .describe('Short, action-first title. No timestamp in the title.'),
            notes: z.string().optional().describe('Optional extra context — keep brief.'),
            dueAt: z.iso
                .datetime({ offset: true, local: true })
                .optional()
                .describe(
                    "ISO datetime in the user's local time when this should happen. Include hours/minutes if the user gave a time. Omit if no specific time."
                ),
            priority: z
                .enum(['low', 'medium', 'high'])
                .default('medium')
                .describe('Use "high" only for important / urgent items.')
        })
    }),

    completeTodo: tool({
        description: 'Mark a todo as completed by id.',
        inputSchema: z.object({ id: z.string() })
    }),

    listTodos: tool({
        description: "List the user's open todos.",
        inputSchema: z.object({})
    }),

    pullGmailTodos: tool({
        description:
            'Pull recent Gmail messages and return suggested todos for ones that genuinely require user action. The user must have connected Gmail in Settings.',
        inputSchema: z.object({
            since: z.iso.datetime().optional()
        })
    })
} as const
