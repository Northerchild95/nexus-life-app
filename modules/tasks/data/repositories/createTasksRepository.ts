import { TasksRepositoryImpl } from './TasksRepositoryImpl';

export function createTasksRepository() {
  return new TasksRepositoryImpl();
}
