import { canMergeIntents, mergeIntents } from '@/modules/assistant/domain/parsers';
import type { AssistantIntent } from '@/modules/assistant/domain/entities';

const tasks: AssistantIntent[] = [
  { kind: 'task', title: 'Pagar la luz', priority: 'medium', dueDate: '2026-11-20' },
  { kind: 'task', title: 'Pagar el gas', priority: 'high', dueDate: '2026-11-20' },
  { kind: 'task', title: 'Reclamar exámenes', priority: 'low', dueDate: '2026-11-20' },
];

describe('assistant intent merger', () => {
  it('merges same-kind intents into one draft', () => {
    expect(canMergeIntents(tasks)).toBe(true);
    expect(mergeIntents(tasks)).toEqual({
      kind: 'task',
      title: 'Pagar la luz, Pagar el gas, Reclamar exámenes',
      priority: 'high',
      dueDate: '2026-11-20',
    });
  });

  it('refuses to merge mixed kinds', () => {
    const mixed: AssistantIntent[] = [
      tasks[0],
      { kind: 'expense', title: 'Café', amount: 3, category: 'food', date: '2026-11-16' },
    ];

    expect(canMergeIntents(mixed)).toBe(false);
    expect(() => mergeIntents(mixed)).toThrow();
  });
});
