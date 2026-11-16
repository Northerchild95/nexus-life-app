import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { Task } from '@/modules/tasks/domain/entities';
import { GetTasksUseCase } from '@/modules/tasks/domain/useCases';

type State = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
};

export function useTasks() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ tasks: [], isLoading: true, error: null });

  // Memoized so `loadTasks` keeps a stable identity; otherwise the effect
  // below would refetch on every render (infinite loop).
  const getTasksUseCase = useMemo(
    () => new GetTasksUseCase(createTasksRepository()),
    [],
  );

  const loadTasks = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const tasks = await getTasksUseCase.execute();
      setState({ tasks, isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('tasks.errorLoading');
      setState((prev) => ({ ...prev, tasks: [], isLoading: false, error: message }));
    }
  }, [getTasksUseCase, t]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  return {
    ...state,
    loadTasks,
  };
}
