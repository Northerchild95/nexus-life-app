import { ExpenseRepositoryImpl } from './ExpenseRepositoryImpl';

export function createExpenseRepository() {
  return new ExpenseRepositoryImpl();
}
