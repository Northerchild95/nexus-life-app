import type { Expense, ExpenseCategory } from '../entities';

export interface CreateExpenseParams {
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  customCategory?: string;
  isVerified?: boolean;
}

export interface UpdateExpenseParams {
  title?: string;
  amount?: number;
  date?: string;
  category?: ExpenseCategory;
  customCategory?: string;
  isVerified?: boolean;
}

export interface GetExpensesParams {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
}

export interface ExpenseRepository {
  create(params: CreateExpenseParams): Promise<Expense>;
  getById(id: string): Promise<Expense | null>;
  getAll(params?: GetExpensesParams): Promise<Expense[]>;
  update(id: string, params: UpdateExpenseParams): Promise<Expense>;
  delete(id: string): Promise<void>;
}
