import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { createGetWeeklySummaryUseCase } from '@/modules/assistant/data/useCases';

/** Builds a real, localized weekly summary from the app's repositories. */
export function useWeeklySummary() {
  const { t } = useTranslation();
  const useCase = useMemo(() => createGetWeeklySummaryUseCase(), []);

  const buildSummary = useCallback(async (): Promise<string> => {
    try {
      const summary = await useCase.execute();
      const base = t('assistant.replies.summaryWithData', {
        pending: summary.pendingTasks,
        high: summary.highPriorityTasks,
        completed: summary.completedTasksThisWeek,
        expenses: summary.expenseCount,
        spent: summary.expensesThisWeek.toFixed(2),
        habitsDone: summary.habitsDoneToday,
        habits: summary.activeHabits,
      });

      if (!summary.topCategory) return base;
      return `${base} ${t('assistant.replies.summaryTopCategory', {
        top: t(`finance.categories.${summary.topCategory}`),
      })}`;
    } catch {
      return t('assistant.replies.summary');
    }
  }, [useCase, t]);

  return { buildSummary };
}
