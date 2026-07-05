import type { TasksRepository, CreateTaskParams } from '../repositories';

export class CreateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(params: CreateTaskParams) {
    return this.tasksRepository.create(params);
  }
}
