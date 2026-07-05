import type { HabitsRepository, UpdateHabitParams } from '../repositories';

export class UpdateHabitUseCase {
  constructor(private habitsRepository: HabitsRepository) {}

  async execute(id: string, params: UpdateHabitParams) {
    return this.habitsRepository.update(id, params);
  }
}
