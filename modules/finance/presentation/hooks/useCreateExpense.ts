import { useCallback, useState } from 'react';

import { createExpenseRepository } from '@/modules/finance/data/repositories';
import type { CreateExpenseParams } from '@/modules/finance/domain/repositories';
import { CreateExpenseUseCase, GetExpensesUseCase } from '@/modules/finance/domain/useCases';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useCreateExpense() {
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
      const message = error instanceof Error ? error.message : 'Error creating expense';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [createExpenseUseCase]);

  return {
    createExpense,
    isLoading: state.isLoading,
    error: state.error,
  };
}
