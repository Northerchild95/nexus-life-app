import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDomainDataStore } from '@/core/store/domainDataStore';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import { GetTasksUseCase } from '@/modules/tasks/domain/useCases';

export function useTasks() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tasks = useDomainDataStore((state) => state.tasks);
  const setTasks = useDomainDataStore((state) => state.setTasks);

  // Memoized so `loadTasks` keeps a stable identity; otherwise the focus
  // effect in TasksScreen would refetch on every render (infinite loop).
  const getTasksUseCase = useMemo(
    () => new GetTasksUseCase(createTasksRepository()),
    [],
  );

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await getTasksUseCase.execute();
      setTasks(loaded);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : t('tasks.errorLoading');
      setTasks([]);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getTasksUseCase, setTasks, t]);

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
  };
}
