import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { createInsightsRepository } from '@/modules/insights/data/repositories';
import { GetInsightsUseCase, GetWeeklyTrendsUseCase } from '@/modules/insights/domain/useCases';
import type { Insight } from '@/modules/insights/domain/entities';

type State = {
  isLoading: boolean;
  error: string | null;
  insight: Insight | null;
};

export function useInsights() {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState<State>({ isLoading: true, error: null, insight: null });

  const getInsightsUseCase = useMemo(() => {
    return new GetInsightsUseCase(createInsightsRepository());
  }, []);

  const getWeeklyTrendsUseCase = useMemo(() => {
    return new GetWeeklyTrendsUseCase(createInsightsRepository());
  }, []);

  const loadInsights = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const today = new Date().toISOString().split('T')[0];
      const insight = await getInsightsUseCase.execute(today);
      setState({ isLoading: false, error: null, insight });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('dashboard.insightsPanel.error');
      setState({ isLoading: false, error: message, insight: null });
    }
  }, [getInsightsUseCase, t, i18n.language]);

  useEffect(() => {
    void loadInsights();
  }, [loadInsights]);

  // Reload insights when screen is focused
  useFocusEffect(
    useCallback(() => {
      void loadInsights();
    }, [loadInsights])
  );

  return {
    ...state,
    isLoading: state.isLoading,
    isError: !!state.error,
    isSuccess: !state.isLoading && !state.error,
    refresh: loadInsights,
  };
}
