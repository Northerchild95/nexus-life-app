import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/core/store/appStore';
import { createDashboardRepository } from '@/modules/dashboard/data/repositories';
import { GetDashboardSummaryUseCase } from '@/modules/dashboard/domain/useCases';
import type {
  DashboardSummaryState,
  DashboardSummaryViewModel,
} from '@/modules/dashboard/presentation/types';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const initialState: DashboardSummaryState = {
  status: 'idle',
  summary: null,
  error: null,
};

export function useDashboardSummary(): DashboardSummaryViewModel {
  const userName = useAppStore((state) => state.session.user?.name);
  const [state, setState] = useState<DashboardSummaryState>(initialState);

  const getDashboardSummaryUseCase = useMemo(() => {
    return new GetDashboardSummaryUseCase(createDashboardRepository());
  }, []);

  const refresh = useCallback(async () => {
    setState((current) => ({
      ...current,
      status: 'loading',
      error: null,
    }));

    try {
      const summary = await getDashboardSummaryUseCase.execute({
        userName,
        date: getTodayKey(),
      });

      setState({
        status: 'success',
        summary,
        error: null,
      });
    } catch (exception) {
      const message =
        exception instanceof Error ? exception.message : 'Unable to load dashboard summary';

      setState((current) => ({
        ...current,
        status: 'error',
        error: message,
      }));
    }
  }, [getDashboardSummaryUseCase, userName]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    isLoading: state.status === 'loading' || state.status === 'idle',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    refresh,
  };
}
