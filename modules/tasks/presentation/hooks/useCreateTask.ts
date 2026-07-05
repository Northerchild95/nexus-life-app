import { useCallback, useState } from 'react';

import { CreateTaskUseCase, GetTasksUseCase } from '@/modules/tasks/domain/useCases';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { CreateTaskParams } from '@/modules/tasks/domain/repositories';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useCreateTask() {
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const tasksRepository = createTasksRepository();
  const createTaskUseCase = new CreateTaskUseCase(tasksRepository);
  const getTasksUseCase = new GetTasksUseCase(tasksRepository);

  const createTask = useCallback(async (params: CreateTaskParams) => {
    setState({ isLoading: true, error: null });

    try {
      const task = await createTaskUseCase.execute(params);
      setState({ isLoading: false, error: null });
      return task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating task';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [createTaskUseCase]);

  const getTasks = useCallback(async () => {
    return getTasksUseCase.execute();
  }, [getTasksUseCase]);

  return {
    createTask,
    getTasks,
    ...state,
  };
}
