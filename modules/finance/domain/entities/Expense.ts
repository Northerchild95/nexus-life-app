export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'bills'
  | 'education'
  | 'other'
  | 'custom';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  customCategory?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
