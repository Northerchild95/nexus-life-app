import { useCallback, useState } from 'react';

import { createHabitsRepository } from '@/modules/habits/data/repositories';
import type { UpdateHabitParams } from '@/modules/habits/domain/repositories';
import { DeleteHabitUseCase, UpdateHabitUseCase } from '@/modules/habits/domain/useCases';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useHabitActions() {
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
      const message = error instanceof Error ? error.message : 'Error updating habit';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateHabitUseCase]);

  const deleteHabit = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      await deleteHabitUseCase.execute(id);
      setState({ isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting habit';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [deleteHabitUseCase]);

  const completeHabit = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      const habitsRepository = createHabitsRepository();
      const habit = await habitsRepository.getById(id);
      if (!habit) throw new Error('Habit not found');

      if (habit.currentCount >= habit.targetCount) {
        const message = `Ya completaste tu objetivo de ${habit.targetCount} veces para este hábito`;
        setState({ isLoading: false, error: message });
        throw new Error(message);
      }

      const newCount = habit.currentCount + 1;
      const isCompleted = newCount >= habit.targetCount;

      const updated = await updateHabitUseCase.execute(id, {
        currentCount: newCount,
        status: isCompleted ? 'completed' : 'active',
      });
      setState({ isLoading: false, error: null });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error completing habit';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateHabitUseCase]);

  return {
    updateHabit,
    deleteHabit,
    completeHabit,
    ...state,
  };
}
