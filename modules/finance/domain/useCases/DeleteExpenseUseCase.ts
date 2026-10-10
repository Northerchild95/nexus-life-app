import type { ExpenseRepository } from '../repositories';

export class DeleteExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(id: string) {
    return this.expenseRepository.delete(id);
  }
}
