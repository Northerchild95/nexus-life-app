import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createExpenseRepository } from '@/modules/finance/data/repositories';
import type { Expense } from '@/modules/finance/domain/entities';
import { GetExpensesUseCase } from '@/modules/finance/domain/useCases';

type State = {
  isLoading: boolean;
  error: string | null;
  expenses: Expense[];
};

export function useExpenses() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ isLoading: true, error: null, expenses: [] });

  const getExpensesUseCase = useMemo(() => {
    return new GetExpensesUseCase(createExpenseRepository());
  }, []);

  const loadExpenses = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const expenses = await getExpensesUseCase.execute();
      setState({ isLoading: false, error: null, expenses });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('finance.errorLoading');
      setState({ isLoading: false, error: message, expenses: [] });
    }
  }, [getExpensesUseCase, t]);

  useEffect(() => {
    void loadExpenses();
  }, [loadExpenses]);

  // Reload expenses when screen is focused
  useFocusEffect(
    useCallback(() => {
      void loadExpenses();
    }, [loadExpenses])
  );

  return {
    ...state,
    isLoading: state.isLoading,
    isError: !!state.error,
    isSuccess: !state.isLoading && !state.error,
    refresh: loadExpenses,
  };
}
