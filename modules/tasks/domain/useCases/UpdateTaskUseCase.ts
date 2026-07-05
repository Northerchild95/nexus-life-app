import type { TasksRepository, UpdateTaskParams } from '../repositories';

export class UpdateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(id: string, params: UpdateTaskParams) {
    return this.tasksRepository.update(id, params);
  }
}
