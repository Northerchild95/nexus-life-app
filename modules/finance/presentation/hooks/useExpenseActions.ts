import { useCallback, useState } from 'react';

import { createExpenseRepository } from '@/modules/finance/data/repositories';
import type { UpdateExpenseParams } from '@/modules/finance/domain/repositories';
import { DeleteExpenseUseCase, UpdateExpenseUseCase } from '@/modules/finance/domain/useCases';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useExpenseActions() {
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const expenseRepository = createExpenseRepository();
  const updateExpenseUseCase = new UpdateExpenseUseCase(expenseRepository);
  const deleteExpenseUseCase = new DeleteExpenseUseCase(expenseRepository);

  const updateExpense = useCallback(async (id: string, params: UpdateExpenseParams) => {
    setState({ isLoading: true, error: null });

    try {
      const expense = await updateExpenseUseCase.execute(id, params);
      setState({ isLoading: false, error: null });
      return expense;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating expense';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateExpenseUseCase]);

  const deleteExpense = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      await deleteExpenseUseCase.execute(id);
      setState({ isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting expense';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [deleteExpenseUseCase]);

  return {
    updateExpense,
    deleteExpense,
    ...state,
  };
}
