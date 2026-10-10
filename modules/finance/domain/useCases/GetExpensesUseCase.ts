import type { ExpenseRepository, GetExpensesParams } from '../repositories';

export class GetExpensesUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(params?: GetExpensesParams) {
    return this.expenseRepository.getAll(params);
  }
}
