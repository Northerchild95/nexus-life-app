import type { AssistantIntent } from '../entities';

export function canMergeIntents(intents: AssistantIntent[]): boolean {
  if (intents.length < 2) return false;
  return intents.every((intent) => intent.kind === intents[0].kind);
}

/** Combines several intents of the same kind into one draft. */
export function mergeIntents(intents: AssistantIntent[]): AssistantIntent {
  if (intents.length === 0) {
    throw new Error('Cannot merge an empty list of intents');
  }
  if (!canMergeIntents(intents)) {
    throw new Error('Cannot merge intents of different kinds');
  }

  const title = intents.map((intent) => intent.title.trim()).filter(Boolean).join(', ');
  const first = intents[0];

  if (first.kind === 'task') {
    const tasks = intents as Extract<AssistantIntent, { kind: 'task' }>[];
    const priority = tasks.some((task) => task.priority === 'high')
      ? 'high'
      : tasks.some((task) => task.priority === 'medium')
        ? 'medium'
        : 'low';

    return {
      kind: 'task',
      title,
      priority,
      dueDate: tasks[0].dueDate,
    };
  }

  const expenses = intents as Extract<AssistantIntent, { kind: 'expense' }>[];
  return {
    kind: 'expense',
    title,
    amount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    category: expenses[0].category,
    date: expenses[0].date,
  };
}
