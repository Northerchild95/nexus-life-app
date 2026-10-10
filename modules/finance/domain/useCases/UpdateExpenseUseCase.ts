import type { ExpenseRepository, UpdateExpenseParams } from '../repositories';

export class UpdateExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(id: string, params: UpdateExpenseParams) {
    return this.expenseRepository.update(id, params);
  }
}
