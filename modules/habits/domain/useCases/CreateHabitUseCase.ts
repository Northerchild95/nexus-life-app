import type { HabitsRepository, CreateHabitParams } from '../repositories';

export class CreateHabitUseCase {
  constructor(private habitsRepository: HabitsRepository) {}

  async execute(params: CreateHabitParams) {
    return this.habitsRepository.create(params);
  }
}
