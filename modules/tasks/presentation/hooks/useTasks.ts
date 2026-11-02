import { useCallback, useEffect, useState } from 'react';

import { GetTasksUseCase } from '@/modules/tasks/domain/useCases';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { Task } from '@/modules/tasks/domain/entities';

type State = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
};

export function useTasks() {
  const [state, setState] = useState<State>({ tasks: [], isLoading: true, error: null });
  const tasksRepository = createTasksRepository();
  const getTasksUseCase = new GetTasksUseCase(tasksRepository);

  const loadTasks = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const tasks = await getTasksUseCase.execute();
      setState({ tasks, isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading tasks';
      setState((prev) => ({ ...prev, tasks: [], isLoading: false, error: message }));
    }
  }, [getTasksUseCase]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    ...state,
    loadTasks,
  };
}
