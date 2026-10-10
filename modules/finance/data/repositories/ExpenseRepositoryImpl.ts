import type { Expense } from '../../domain/entities';
import type {
  CreateExpenseParams,
  ExpenseRepository,
  GetExpensesParams,
  UpdateExpenseParams,
} from '../../domain/repositories';
import { LocalExpenseDataSource } from '../datasources';

export class ExpenseRepositoryImpl implements ExpenseRepository {
  private dataSource = new LocalExpenseDataSource();

  async create(params: CreateExpenseParams): Promise<Expense> {
    return this.dataSource.create(params);
  }

  async getById(id: string): Promise<Expense | null> {
    return this.dataSource.getById(id);
  }

  async getAll(params?: GetExpensesParams): Promise<Expense[]> {
    const expenses = await this.dataSource.getAll();

    if (!params) {
      return expenses;
    }

    let filtered = expenses;

    const { startDate, endDate, category } = params;

    if (startDate !== undefined) {
      filtered = filtered.filter((expense) => expense.date >= startDate);
    }

    if (endDate !== undefined) {
      filtered = filtered.filter((expense) => expense.date <= endDate);
    }

    if (category !== undefined) {
      filtered = filtered.filter((expense) => expense.category === category);
    }

    return filtered;
  }

  async update(id: string, params: UpdateExpenseParams): Promise<Expense> {
    return this.dataSource.update(id, params);
  }

  async delete(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}
