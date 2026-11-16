import type { ExpenseCategory } from '@/modules/finance/domain/entities';
import type { TaskPriority } from '@/modules/tasks/domain/entities';

/**
 * Structured action detected from a free-form chat message.
 *
 * Phase 2 only resolves actions the app can already execute locally:
 * creating an expense or creating a task. A future LLM-backed parser can
 * return the same contract without changing the presentation layer.
 */
export type AssistantExpenseIntent = {
  kind: 'expense';
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
};

export type AssistantTaskIntent = {
  kind: 'task';
  title: string;
  priority: TaskPriority;
  dueDate: string;
};

export type AssistantIntent = AssistantExpenseIntent | AssistantTaskIntent;
