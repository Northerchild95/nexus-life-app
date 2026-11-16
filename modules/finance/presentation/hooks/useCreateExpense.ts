import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createExpenseRepository } from '@/modules/finance/data/repositories';
import type { CreateExpenseParams } from '@/modules/finance/domain/repositories';
import { CreateExpenseUseCase, GetExpensesUseCase } from '@/modules/finance/domain/useCases';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useCreateExpense() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const expenseRepository = createExpenseRepository();
  const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);
  const getExpensesUseCase = new GetExpensesUseCase(expenseRepository);

  const createExpense = useCallback(async (params: CreateExpenseParams) => {
    setState({ isLoading: true, error: null });

    try {
      const expense = await createExpenseUseCase.execute(params);
      setState({ isLoading: false, error: null });
      return expense;
    } catch (error) {
      const message = error instanceof Error ? error.message : t('finance.errorCreating');
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [createExpenseUseCase, t]);

  return {
    createExpense,
    isLoading: state.isLoading,
    error: state.error,
  };
}
