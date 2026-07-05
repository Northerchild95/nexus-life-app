import { HabitsRepositoryImpl } from './HabitsRepositoryImpl';

export function createHabitsRepository() {
  return new HabitsRepositoryImpl();
}
