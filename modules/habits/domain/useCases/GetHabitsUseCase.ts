import type { HabitsRepository, GetHabitsParams } from '../repositories';

export class GetHabitsUseCase {
  constructor(private habitsRepository: HabitsRepository) {}

  async execute(params?: GetHabitsParams) {
    return this.habitsRepository.getAll(params);
  }
}
