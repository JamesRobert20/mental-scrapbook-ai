import { z } from 'zod'

export const todoPrioritySchema = z.enum(['low', 'medium', 'high'])
export const todoSourceSchema = z.enum(['manual', 'voice', 'gmail'])

export const createTodoSchema = z.object({
    title: z.string().min(1),
    notes: z.string().optional(),
    dueAt: z.iso.datetime({ offset: true, local: true }).optional(),
    priority: todoPrioritySchema.default('medium'),
    source: todoSourceSchema.default('manual')
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
