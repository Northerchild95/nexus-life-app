import type { Habit, HabitFrequency, HabitStatus } from '../entities';

export interface CreateHabitParams {
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetCount: number;
}

export interface UpdateHabitParams {
  title?: string;
  description?: string;
  frequency?: HabitFrequency;
  targetCount?: number;
  currentCount?: number;
  status?: HabitStatus;
}

export interface GetHabitsParams {
  status?: HabitStatus;
}

export interface HabitsRepository {
  create(params: CreateHabitParams): Promise<Habit>;
  getById(id: string): Promise<Habit | null>;
  getAll(params?: GetHabitsParams): Promise<Habit[]>;
  update(id: string, params: UpdateHabitParams): Promise<Habit>;
  delete(id: string): Promise<void>;
}
