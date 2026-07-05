import type { HabitsRepository } from '../repositories';

export class DeleteHabitUseCase {
  constructor(private habitsRepository: HabitsRepository) {}

  async execute(id: string) {
    return this.habitsRepository.delete(id);
  }
}
