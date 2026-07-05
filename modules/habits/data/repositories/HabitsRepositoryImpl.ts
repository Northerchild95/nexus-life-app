import type { HabitsRepository, CreateHabitParams, UpdateHabitParams, GetHabitsParams } from '../../domain/repositories';
import { LocalHabitsDataSource } from '../datasources/LocalHabitsDataSource';

export class HabitsRepositoryImpl implements HabitsRepository {
  private dataSource: LocalHabitsDataSource;

  constructor() {
    this.dataSource = new LocalHabitsDataSource();
  }

  async create(params: CreateHabitParams) {
    return this.dataSource.create(params);
  }

  async getById(id: string) {
    return this.dataSource.getById(id);
  }

  async getAll(params?: GetHabitsParams) {
    const habits = await this.dataSource.getAll();
    
    if (params?.status) {
      return habits.filter((h) => h.status === params.status);
    }
    
    return habits;
  }

  async update(id: string, params: UpdateHabitParams) {
    return this.dataSource.update(id, params);
  }

  async delete(id: string) {
    return this.dataSource.delete(id);
  }
}
