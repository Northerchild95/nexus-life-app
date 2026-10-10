import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Habit } from '@/modules/habits/domain/entities';
import type { CreateHabitParams, UpdateHabitParams } from '@/modules/habits/domain/repositories';

const HABITS_KEY = '@nexus_habits';

const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isToday = (date: string): boolean => {
  return isSameDay(date, new Date().toISOString());
};

export class LocalHabitsDataSource {
  async create(params: CreateHabitParams): Promise<Habit> {
    const habits = await this.getAll();
    const newHabit: Habit = {
      id: Date.now().toString(),
      ...params,
      currentCount: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    habits.push(newHabit);
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return newHabit;
  }

  async getById(id: string): Promise<Habit | null> {
    const habits = await this.getAll();
    return habits.find((h) => h.id === id) || null;
  }

  async getAll(): Promise<Habit[]> {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    const habits: Habit[] = data ? JSON.parse(data) : [];
    const today = new Date().toISOString();
    let needsUpdate = false;

    // Reset counters for habits completed on previous days
    const resetHabits = habits.map((habit): Habit => {
      if (habit.lastCompletedDate && !isToday(habit.lastCompletedDate)) {
        needsUpdate = true;
        return {
          ...habit,
          currentCount: 0,
          status: 'active',
          lastCompletedDate: undefined,
          updatedAt: today,
        };
      }
      return habit;
    });

    if (needsUpdate) {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(resetHabits));
    }

    return resetHabits;
  }

  async update(id: string, params: UpdateHabitParams): Promise<Habit> {
    const habits = await this.getAll();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) throw new Error('Habit not found');
    
    habits[index] = {
      ...habits[index],
      ...params,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return habits[index];
  }

  async delete(id: string): Promise<void> {
    const habits = await this.getAll();
    const filtered = habits.filter((h) => h.id !== id);
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(filtered));
  }
}
