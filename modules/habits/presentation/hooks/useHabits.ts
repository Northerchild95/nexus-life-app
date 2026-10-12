import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { createHabitsRepository } from '@/modules/habits/data/repositories';
import { GetHabitsUseCase } from '@/modules/habits/domain/useCases';

type State = {
  isLoading: boolean;
  error: string | null;
  habits: import('@/modules/habits/domain/entities').Habit[];
};

export function useHabits() {
  const [state, setState] = useState<State>({ isLoading: false, error: null, habits: [] });
  const habitsRepository = createHabitsRepository();
  const getHabitsUseCase = new GetHabitsUseCase(habitsRepository);

  const loadHabits = useCallback(async () => {
    setState({ isLoading: true, error: null, habits: [] });

    try {
      const habits = await getHabitsUseCase.execute();
      setState({ isLoading: false, error: null, habits });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading habits';
      setState({ isLoading: false, error: message, habits: [] });
    }
  }, [getHabitsUseCase]);

  return {
    loadHabits,
    ...state,
  };
}

export function useHabitsWithAutoReload() {
  const { loadHabits, ...state } = useHabits();

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits])
  );

  return {
    loadHabits,
    ...state,
  };
}
