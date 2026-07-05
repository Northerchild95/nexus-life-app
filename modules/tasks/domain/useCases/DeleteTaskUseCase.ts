import type { TasksRepository } from '../repositories';

export class DeleteTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(id: string) {
    return this.tasksRepository.delete(id);
  }
}
