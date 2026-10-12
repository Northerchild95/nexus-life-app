import type { Expense, ExpenseCategory } from '@/modules/finance/domain/entities';
import type { Habit } from '@/modules/habits/domain/entities';
import type { Task } from '@/modules/tasks/domain/entities';
import type { Insight, ProductivityStats, FinanceStats, WeeklyTrend, Achievement } from '../../domain/entities';
import { createExpenseRepository } from '@/modules/finance/data/repositories';
import { createHabitsRepository } from '@/modules/habits/data/repositories';
import { createTasksRepository } from '@/modules/tasks/data/repositories';

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Comida',
  transport: 'Transporte',
  entertainment: 'Entretenimiento',
  shopping: 'Compras',
  health: 'Salud',
  bills: 'Facturas',
  education: 'Educación',
  other: 'Otros',
  custom: 'Personalizada',
};

export class LocalInsightsDataSource {
  private tasksRepository = createTasksRepository();
  private habitsRepository = createHabitsRepository();
  private expensesRepository = createExpenseRepository();

  async getInsights(date: string): Promise<Insight> {
    const productivity = await this.calculateProductivityStats(date);
    const finance = await this.calculateFinanceStats(date);
    const weeklyTrends = await this.calculateWeeklyTrends(4);
    const achievements = await this.calculateAchievements();

    const now = new Date().toISOString();

    return {
      id: `insight_${date}`,
      date,
      productivity,
      finance,
      weeklyTrends,
      achievements,
      createdAt: now,
      updatedAt: now,
    };
  }

  private async calculateProductivityStats(date: string): Promise<ProductivityStats> {
    const tasks = await this.tasksRepository.getAll();
    const habits = await this.habitsRepository.getAll();

    const tasksCompleted = tasks.filter((t) => t.status === 'completed' && t.createdAt.startsWith(date)).length;
    const tasksTotal = tasks.filter((t) => t.createdAt.startsWith(date)).length;
    const tasksCompletionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

    const habitsCompleted = habits.filter((h) => h.lastCompletedDate?.startsWith(date)).length;
    const habitsTotal = habits.length;
    const habitsCompletionRate = habitsTotal > 0 ? (habitsCompleted / habitsTotal) * 100 : 0;

    // Focus sessions would need to be tracked separately
    const focusSessionsCompleted = 0;
    const focusMinutesTotal = 0;

    return {
      tasksCompleted,
      tasksTotal,
      tasksCompletionRate,
      habitsCompleted,
      habitsTotal,
      habitsCompletionRate,
      focusSessionsCompleted,
      focusMinutesTotal,
    };
  }

  private async calculateFinanceStats(date: string): Promise<FinanceStats> {
    const expenses = await this.expensesRepository.getAll();
    const todayExpenses = expenses.filter((e) => e.date.startsWith(date));

    const totalSpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const expenseCount = todayExpenses.length;
    const averageExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;
    const verifiedExpenses = todayExpenses.filter((e) => e.isVerified).length;

    // Calculate top category
    const categoryTotals = todayExpenses.reduce((acc, expense) => {
      const category = expense.category === 'custom' && expense.customCategory
        ? expense.customCategory
        : CATEGORY_LABELS[expense.category];
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const entries = Object.entries(categoryTotals);
    const topCategory = entries.length > 0 ? entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0] : 'N/A';
    const topCategoryAmount = entries.length > 0 ? Math.max(...Object.values(categoryTotals)) : 0;

    return {
      totalSpent,
      expenseCount,
      averageExpense,
      topCategory,
      topCategoryAmount,
      verifiedExpenses,
    };
  }

  private async calculateWeeklyTrends(weeks: number): Promise<WeeklyTrend[]> {
    const trends: WeeklyTrend[] = [];
    const expenses = await this.expensesRepository.getAll();
    const tasks = await this.tasksRepository.getAll();
    const habits = await this.habitsRepository.getAll();

    for (let i = 0; i < weeks; i++) {
      const weekDate = this.getWeekDate(i);
      const weekStart = weekDate.toISOString().split('T')[0];

      const weekTasksCompleted = tasks.filter((t) => t.createdAt.startsWith(weekStart) && t.status === 'completed').length;
      const weekHabitsCompleted = habits.filter((h) => h.lastCompletedDate?.startsWith(weekStart)).length;
      const weekTotalSpent = expenses.filter((e) => e.date.startsWith(weekStart)).reduce((sum, e) => sum + e.amount, 0);

      trends.push({
        weekNumber: i + 1,
        tasksCompleted: weekTasksCompleted,
        habitsCompleted: weekHabitsCompleted,
        totalSpent: weekTotalSpent,
      });
    }

    return trends;
  }

  private getWeekDate(weeksAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - (weeksAgo * 7));
    return date;
  }

  private async calculateAchievements(): Promise<Achievement[]> {
    const tasks = await this.tasksRepository.getAll();
    const habits = await this.habitsRepository.getAll();
    const expenses = await this.expensesRepository.getAll();

    const achievements: Achievement[] = [];

    // Achievement: First task completed
    if (tasks.some((t) => t.status === 'completed')) {
      achievements.push({
        id: 'first_task',
        title: 'Primera Tarea',
        description: 'Completaste tu primera tarea',
        icon: 'checkmark-circle',
        unlocked: true,
      });
    }

    // Achievement: Habit streak
    const habitWithStreak = habits.find((h) => h.currentCount >= 3);
    if (habitWithStreak) {
      achievements.push({
        id: 'habit_streak',
        title: 'Racha de Hábito',
        description: `Mantuviste un hábito por 3 días`,
        icon: 'flame',
        unlocked: true,
      });
    }

    // Achievement: Financial tracker
    if (expenses.length >= 5) {
      achievements.push({
        id: 'financial_tracker',
        title: 'Rastreador Financiero',
        description: 'Registraste 5 gastos',
        icon: 'wallet',
        unlocked: true,
      });
    }

    // Achievement: Verified expenses
    const verifiedCount = expenses.filter((e) => e.isVerified).length;
    if (verifiedCount >= 3) {
      achievements.push({
        id: 'verified_expenses',
        title: 'Gastos Verificados',
        description: 'Verificaste 3 gastos',
        icon: 'checkmark-done',
        unlocked: true,
      });
    }

    return achievements;
  }

  async getWeeklyTrends(weeks: number): Promise<Insight['weeklyTrends']> {
    return this.calculateWeeklyTrends(weeks);
  }
}
