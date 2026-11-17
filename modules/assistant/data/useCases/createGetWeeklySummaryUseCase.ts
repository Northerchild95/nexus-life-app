import { createExpenseRepository } from '@/modules/finance/data/repositories';
import { createHabitsRepository } from '@/modules/habits/data/repositories';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import { GetWeeklySummaryUseCase } from '@/modules/assistant/domain/useCases';

export function createGetWeeklySummaryUseCase() {
  return new GetWeeklySummaryUseCase({
    tasks: createTasksRepository(),
    expenses: createExpenseRepository(),
    habits: createHabitsRepository(),
  });
}
