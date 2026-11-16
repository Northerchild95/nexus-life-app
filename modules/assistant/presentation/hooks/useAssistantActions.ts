import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { refreshRegisteredScreens } from '@/core/state/screenRefresh';
import { createExpenseRepository } from '@/modules/finance/data/repositories';
import { CreateExpenseUseCase } from '@/modules/finance/domain/useCases';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import { CreateTaskUseCase } from '@/modules/tasks/domain/useCases';

import type { AssistantIntent } from '../../domain/entities';

export function useAssistantActions() {
  const { t } = useTranslation();
  const [isExecuting, setIsExecuting] = useState(false);

  const createExpenseUseCase = useMemo(
    () => new CreateExpenseUseCase(createExpenseRepository()),
    [],
  );
  const createTaskUseCase = useMemo(
    () => new CreateTaskUseCase(createTasksRepository()),
    [],
  );

  const executeIntent = useCallback(
    async (intent: AssistantIntent) => {
      const title = intent.title.trim();
      if (!title) {
        throw new Error(t('assistant.errors.missingTitle'));
      }

      setIsExecuting(true);

      try {
        if (intent.kind === 'expense') {
          if (!Number.isFinite(intent.amount) || intent.amount <= 0) {
            throw new Error(t('assistant.errors.invalidAmount'));
          }

          const expense = await createExpenseUseCase.execute({
            title,
            amount: intent.amount,
            category: intent.category,
            date: intent.date,
          });
          await refreshRegisteredScreens();
          return expense;
        }

        const task = await createTaskUseCase.execute({
          title,
          status: 'pending',
          priority: intent.priority,
          dueDate: intent.dueDate,
        });
        await refreshRegisteredScreens();
        return task;
      } catch (error) {
        const fallback =
          intent.kind === 'expense'
            ? t('assistant.errors.saveExpense')
            : t('assistant.errors.saveTask');

        throw new Error(
          error instanceof Error && error.message ? error.message : fallback,
        );
      } finally {
        setIsExecuting(false);
      }
    },
    [createExpenseUseCase, createTaskUseCase, t],
  );

  return {
    executeIntent,
    isExecuting,
  };
}
