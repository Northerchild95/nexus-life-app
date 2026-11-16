import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateHabitUseCase, GetHabitsUseCase } from '@/modules/habits/domain/useCases';
import { createHabitsRepository } from '@/modules/habits/data/repositories';
import type { CreateHabitParams } from '@/modules/habits/domain/repositories';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useCreateHabit() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const habitsRepository = createHabitsRepository();
  const createHabitUseCase = new CreateHabitUseCase(habitsRepository);
  const getHabitsUseCase = new GetHabitsUseCase(habitsRepository);

  const createHabit = useCallback(async (params: CreateHabitParams) => {
    setState({ isLoading: true, error: null });

    try {
      const habit = await createHabitUseCase.execute(params);
      setState({ isLoading: false, error: null });
      return habit;
    } catch (error) {
      const message = error instanceof Error ? error.message : t('habits.errorCreating');
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [createHabitUseCase, t]);

  return {
    createHabit,
    ...state,
  };
}
