import type { ExpenseRepository } from '@/modules/finance/domain/repositories';
import type { HabitsRepository } from '@/modules/habits/domain/repositories';
import type { TasksRepository } from '@/modules/tasks/domain/repositories';

export type WeeklySummary = {
  pendingTasks: number;
  completedTasksThisWeek: number;
  highPriorityTasks: number;
  expensesThisWeek: number;
  expenseCount: number;
  topCategory: string | null;
  habitsDoneToday: number;
  activeHabits: number;
};

type Dependencies = {
  tasks: TasksRepository;
  expenses: ExpenseRepository;
  habits: HabitsRepository;
};

/** Monday-based week start in local time. */
const startOfWeek = (now: Date) => {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};

const inRange = (value: string | undefined, from: Date, to: Date): boolean => {
  if (!value) return false;
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);
  return !Number.isNaN(date.getTime()) && date >= from && date <= to;
};

export class GetWeeklySummaryUseCase {
  constructor(private readonly repositories: Dependencies) {}

  async execute(now = new Date()): Promise<WeeklySummary> {
    const [tasks, expenses, habits] = await Promise.all([
      this.repositories.tasks.getAll(),
      this.repositories.expenses.getAll(),
      this.repositories.habits.getAll(),
    ]);

    const from = startOfWeek(now);
    const todayKey = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`;

    const pendingTasks = tasks.filter((task) => task.status !== 'completed');
    const categoryTotals = new Map<string, number>();
    let expensesThisWeek = 0;
    let expenseCount = 0;

    for (const expense of expenses) {
      if (!inRange(expense.date, from, now)) continue;
      expensesThisWeek += expense.amount;
      expenseCount += 1;
      categoryTotals.set(
        expense.category,
        (categoryTotals.get(expense.category) ?? 0) + expense.amount,
      );
    }

    const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const activeHabits = habits.filter((habit) => habit.status === 'active');

    return {
      pendingTasks: pendingTasks.length,
      completedTasksThisWeek: tasks.filter(
        (task) => task.status === 'completed' && inRange(task.updatedAt, from, now),
      ).length,
      highPriorityTasks: pendingTasks.filter((task) => task.priority === 'high').length,
      expensesThisWeek,
      expenseCount,
      topCategory,
      habitsDoneToday: activeHabits.filter((habit) => habit.lastCompletedDate === todayKey)
        .length,
      activeHabits: activeHabits.length,
    };
  }
}
