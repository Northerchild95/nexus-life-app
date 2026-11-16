import { parseAssistantIntent } from '@/modules/assistant/domain/parsers';

const NOW = new Date(2026, 10, 16, 10, 0, 0); // Monday, 16 Nov 2026

describe('parseAssistantIntent', () => {
  it('parses a Spanish expense with amount and category', () => {
    expect(parseAssistantIntent('Gasté $180 en comida hoy', { now: NOW })).toEqual({
      kind: 'expense',
      title: 'Comida',
      amount: 180,
      category: 'food',
      date: '2026-11-16',
    });
  });

  it('parses an English expense and strips the title', () => {
    expect(
      parseAssistantIntent('Spent $24.50 on lunch with the team today', { now: NOW }),
    ).toEqual({
      kind: 'expense',
      title: 'Lunch with the team',
      amount: 24.5,
      category: 'food',
      date: '2026-11-16',
    });
  });

  it('handles thousands and comma decimals', () => {
    expect(parseAssistantIntent('Pagué 1.234,56 de alquiler', { now: NOW })).toEqual({
      kind: 'expense',
      title: 'Alquiler',
      amount: 1234.56,
      category: 'bills',
      date: '2026-11-16',
    });
  });

  it('uses yesterday for past expenses', () => {
    expect(parseAssistantIntent('Gasté 20 en café ayer', { now: NOW })).toMatchObject({
      kind: 'expense',
      amount: 20,
      category: 'food',
      date: '2026-11-15',
    });
  });

  it('parses a Spanish reminder as a task', () => {
    expect(parseAssistantIntent('Recuérdame pagar el internet mañana', { now: NOW })).toEqual({
      kind: 'task',
      title: 'Pagar el internet',
      priority: 'medium',
      dueDate: '2026-11-17',
    });
  });

  it('parses priority and explicit dates for tasks', () => {
    expect(
      parseAssistantIntent(
        'Add a high priority task to submit the monthly report on 20/11/2026',
        { now: NOW },
      ),
    ).toEqual({
      kind: 'task',
      title: 'Submit the monthly report',
      priority: 'high',
      dueDate: '2026-11-20',
    });
  });

  it('turns an action request without an amount into a task', () => {
    expect(parseAssistantIntent('Buy milk tomorrow', { now: NOW })).toEqual({
      kind: 'task',
      title: 'Buy milk',
      priority: 'medium',
      dueDate: '2026-11-17',
    });
  });

  it('resolves upcoming weekdays', () => {
    expect(parseAssistantIntent('Remind me to call mom on Friday', { now: NOW })).toEqual({
      kind: 'task',
      title: 'Call mom',
      priority: 'medium',
      dueDate: '2026-11-20',
    });
  });

  it('returns null for messages that are not actionable', () => {
    expect(parseAssistantIntent('How am I doing this week?', { now: NOW })).toBeNull();
    expect(parseAssistantIntent('New habit: read 20 min daily', { now: NOW })).toBeNull();
  });
});
