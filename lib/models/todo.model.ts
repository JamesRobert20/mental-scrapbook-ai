import type { InferSelectModel } from 'drizzle-orm';

import { todos } from '@/lib/db/schema';

export type TodoRow = InferSelectModel<typeof todos>;

export type TodoCategory = 'important' | 'schedule' | 'general';
export type TodoSource = 'manual' | 'voice' | 'gmail';
export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  dueAt: string | null;
  priority: TodoPriority;
  category: TodoCategory;
  timeLabel: string | null;
  source: TodoSource;
  createdAt: string;
  completedAt: string | null;
};

export function mapTodoRow(row: TodoRow): Todo {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    notes: row.notes,
    dueAt: row.dueAt,
    priority: row.priority as TodoPriority,
    category: row.category as TodoCategory,
    timeLabel: row.timeLabel,
    source: row.source as TodoSource,
    createdAt: row.createdAt,
    completedAt: row.completedAt,
  };
}
