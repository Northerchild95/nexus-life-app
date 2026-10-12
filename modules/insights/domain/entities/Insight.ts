export interface ProductivityStats {
  tasksCompleted: number;
  tasksTotal: number;
  tasksCompletionRate: number;
  habitsCompleted: number;
  habitsTotal: number;
  habitsCompletionRate: number;
  focusSessionsCompleted: number;
  focusMinutesTotal: number;
}

export interface FinanceStats {
  totalSpent: number;
  expenseCount: number;
  averageExpense: number;
  topCategory: string;
  topCategoryAmount: number;
  verifiedExpenses: number;
}

export interface WeeklyTrend {
  weekNumber: number;
  tasksCompleted: number;
  habitsCompleted: number;
  totalSpent: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Insight {
  id: string;
  date: string;
  productivity: ProductivityStats;
  finance: FinanceStats;
  weeklyTrends: WeeklyTrend[];
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}
