import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '../../domain/entities';
import type { CreateTaskParams, UpdateTaskParams } from '../../domain/repositories';

const TASKS_STORAGE_KEY = '@nexus_tasks';

export class LocalTasksDataSource {
  private async getTasksFromStorage(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading tasks from storage:', error);
      return [];
    }
  }

  private async saveTasksToStorage(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      throw error;
    }
  }

  async create(params: CreateTaskParams): Promise<Task> {
    const tasks = await this.getTasksFromStorage();
    const now = new Date().toISOString();
    const newTask: Task = {
      ...params,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    tasks.push(newTask);
    await this.saveTasksToStorage(tasks);
    return newTask;
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = await this.getTasksFromStorage();
    return tasks.find((task) => task.id === id) || null;
  }

  async getAll(): Promise<Task[]> {
    return this.getTasksFromStorage();
  }

  async update(id: string, params: UpdateTaskParams): Promise<Task> {
    const tasks = await this.getTasksFromStorage();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...params,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    await this.saveTasksToStorage(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.getTasksFromStorage();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    await this.saveTasksToStorage(filteredTasks);
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tasks from storage:', error);
      throw error;
    }
  }
}
