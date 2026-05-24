import { z } from 'zod';

export const todoCategorySchema = z.enum(['important', 'schedule', 'general']);
export const todoPrioritySchema = z.enum(['low', 'medium', 'high']);
export const todoSourceSchema = z.enum(['manual', 'voice', 'gmail']);

export const createTodoSchema = z.object({
  title: z.string().min(1),
  notes: z.string().optional(),
  dueAt: z.iso.datetime().optional(),
  priority: todoPrioritySchema.default('medium'),
  category: todoCategorySchema.default('general'),
  timeLabel: z.string().optional(),
  source: todoSourceSchema.default('manual'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
