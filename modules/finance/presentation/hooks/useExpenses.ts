import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDomainDataStore } from '@/core/store/domainDataStore';
import { createExpenseRepository } from '@/modules/finance/data/repositories';
import { GetExpensesUseCase } from '@/modules/finance/domain/useCases';

export function useExpenses() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const expenses = useDomainDataStore((state) => state.expenses);
  const setExpenses = useDomainDataStore((state) => state.setExpenses);

  const getExpensesUseCase = useMemo(
    () => new GetExpensesUseCase(createExpenseRepository()),
    [],
  );

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loaded = await getExpensesUseCase.execute();
      setExpenses(loaded);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : t('finance.errorLoading');
      setExpenses([]);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getExpensesUseCase, setExpenses, t]);

  return {
    expenses,
    isLoading,
    isError: !!error,
    error,
    isSuccess: !isLoading && !error,
    refresh: loadExpenses,
  };
}
