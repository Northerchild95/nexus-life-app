import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createHabitsRepository } from '@/modules/habits/data/repositories';
import type { UpdateHabitParams } from '@/modules/habits/domain/repositories';
import { DeleteHabitUseCase, UpdateHabitUseCase } from '@/modules/habits/domain/useCases';

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

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useHabitActions() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const habitsRepository = createHabitsRepository();
  const updateHabitUseCase = new UpdateHabitUseCase(habitsRepository);
  const deleteHabitUseCase = new DeleteHabitUseCase(habitsRepository);

  const updateHabit = useCallback(async (id: string, params: UpdateHabitParams) => {
    setState({ isLoading: true, error: null });

    try {
      const habit = await updateHabitUseCase.execute(id, params);
      setState({ isLoading: false, error: null });
      return habit;
    } catch (error) {
      const message = error instanceof Error ? error.message : t('habits.errorUpdating');
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateHabitUseCase, t]);

  const deleteHabit = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      await deleteHabitUseCase.execute(id);
      setState({ isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('habits.errorDeleting');
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [deleteHabitUseCase, t]);

  const completeHabit = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      const habitsRepository = createHabitsRepository();
      const habit = await habitsRepository.getById(id);
      if (!habit) throw new Error(t('habits.errorNotFound'));

      const today = new Date().toISOString();

      // Check if already reached the target - return early without error
      if (habit.currentCount >= habit.targetCount) {
        setState({ isLoading: false, error: null });
        return habit;
      }

      // Reset counter if last completion was from a previous day
      let newCount = habit.currentCount + 1;
      if (habit.lastCompletedDate && !isToday(habit.lastCompletedDate)) {
        newCount = 1;
      }

      const isCompleted = newCount >= habit.targetCount;

      const updated = await updateHabitUseCase.execute(id, {
        currentCount: newCount,
        status: isCompleted ? 'completed' : 'active',
        lastCompletedDate: today,
      });
      setState({ isLoading: false, error: null });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : t('habits.errorCompleting');
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateHabitUseCase, t]);

  return {
    updateHabit,
    deleteHabit,
    completeHabit,
    ...state,
  };
}
