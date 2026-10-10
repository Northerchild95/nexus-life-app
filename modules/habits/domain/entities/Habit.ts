export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type HabitStatus = 'active' | 'paused' | 'completed';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetCount: number;
  currentCount: number;
  status: HabitStatus;
  lastCompletedDate?: string;
  createdAt: string;
  updatedAt: string;
}
