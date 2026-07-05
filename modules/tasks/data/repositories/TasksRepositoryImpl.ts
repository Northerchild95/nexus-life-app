import type { CreateTaskParams, GetTasksParams, TasksRepository, UpdateTaskParams } from '../../domain/repositories';
import { LocalTasksDataSource } from '../datasources';

export class TasksRepositoryImpl implements TasksRepository {
  private dataSource: LocalTasksDataSource;

  constructor() {
    this.dataSource = new LocalTasksDataSource();
  }

  async create(params: CreateTaskParams) {
    const existingTasks = await this.dataSource.getAll();
    const isDuplicate = existingTasks.some(
      (task) => task.title.toLowerCase() === params.title.toLowerCase() && task.status !== 'completed'
    );
    
    if (isDuplicate) {
      throw new Error('Ya existe una tarea activa con este título');
    }
    
    return this.dataSource.create(params);
  }

  async getById(id: string) {
    return this.dataSource.getById(id);
  }

  async getAll(params?: GetTasksParams) {
    const tasks = await this.dataSource.getAll();
    
    if (!params) {
      return tasks;
    }

    let filteredTasks = tasks;
    
    if (params.status) {
      filteredTasks = filteredTasks.filter((task) => task.status === params.status);
    }
    
    if (params.dueDate) {
      filteredTasks = filteredTasks.filter((task) => task.dueDate === params.dueDate);
    }
    
    return filteredTasks;
  }

  async update(id: string, params: UpdateTaskParams) {
    return this.dataSource.update(id, params);
  }

  async delete(id: string) {
    return this.dataSource.delete(id);
  }
}
