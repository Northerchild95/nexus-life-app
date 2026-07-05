import { useCallback, useState } from 'react';

import { UpdateTaskUseCase, DeleteTaskUseCase } from '@/modules/tasks/domain/useCases';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { UpdateTaskParams } from '@/modules/tasks/domain/repositories';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useTaskActions() {
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const tasksRepository = createTasksRepository();
  const updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);
  const deleteTaskUseCase = new DeleteTaskUseCase(tasksRepository);

  const updateTask = useCallback(async (id: string, params: UpdateTaskParams) => {
    setState({ isLoading: true, error: null });

    try {
      const task = await updateTaskUseCase.execute(id, params);
      setState({ isLoading: false, error: null });
      return task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating task';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateTaskUseCase]);

  const deleteTask = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      await deleteTaskUseCase.execute(id);
      setState({ isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting task';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [deleteTaskUseCase]);

  const completeTask = useCallback(async (id: string) => {
    return updateTask(id, { status: 'completed' });
  }, [updateTask]);

  return {
    updateTask,
    deleteTask,
    completeTask,
    ...state,
  };
}
