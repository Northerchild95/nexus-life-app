import type { Task } from '../entities';

export type CreateTaskParams = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTaskParams = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

export type GetTasksParams = {
  status?: Task['status'];
  dueDate?: string;
};

export interface TasksRepository {
  create(params: CreateTaskParams): Promise<Task>;
  getById(id: string): Promise<Task | null>;
  getAll(params?: GetTasksParams): Promise<Task[]>;
  update(id: string, params: UpdateTaskParams): Promise<Task>;
  delete(id: string): Promise<void>;
}
