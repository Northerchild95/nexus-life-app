import type { TasksRepository, GetTasksParams } from '../repositories';

export class GetTasksUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(params?: GetTasksParams) {
    return this.tasksRepository.getAll(params);
  }
}
