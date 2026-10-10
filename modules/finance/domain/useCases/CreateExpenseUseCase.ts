import type { ExpenseRepository, CreateExpenseParams } from '../repositories';

export class CreateExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(params: CreateExpenseParams) {
    return this.expenseRepository.create(params);
  }
}
