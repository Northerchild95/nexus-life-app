import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Expense } from '../../domain/entities';
import type { CreateExpenseParams, UpdateExpenseParams } from '../../domain/repositories';

const EXPENSES_STORAGE_KEY = '@nexus_expenses';

export class LocalExpenseDataSource {
  private async getExpensesFromStorage(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
      const expenses: Expense[] = data ? JSON.parse(data) : [];

      // Migration: add isVerified field to existing expenses
      const migrated = expenses.map((expense) => ({
        ...expense,
        isVerified: expense.isVerified ?? false,
      }));

      // Save if migration was needed
      if (migrated.some((e, i) => e.isVerified !== expenses[i].isVerified)) {
        await this.saveExpensesToStorage(migrated);
      }

      return migrated;
    } catch (error) {
      console.error('Error reading expenses from storage:', error);
      return [];
    }
  }

  private async saveExpensesToStorage(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to storage:', error);
      throw error;
    }
  }

  async create(params: CreateExpenseParams): Promise<Expense> {
    const expenses = await this.getExpensesFromStorage();
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...params,
      id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isVerified: params.isVerified ?? false,
      createdAt: now,
      updatedAt: now,
    };

    expenses.push(newExpense);
    await this.saveExpensesToStorage(expenses);
    return newExpense;
  }

  async getById(id: string): Promise<Expense | null> {
    const expenses = await this.getExpensesFromStorage();
    return expenses.find((expense) => expense.id === id) || null;
  }

  async getAll(): Promise<Expense[]> {
    return this.getExpensesFromStorage();
  }

  async update(id: string, params: UpdateExpenseParams): Promise<Expense> {
    const expenses = await this.getExpensesFromStorage();
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    if (expenseIndex === -1) {
      throw new Error(`Expense with id ${id} not found`);
    }

    const updatedExpense: Expense = {
      ...expenses[expenseIndex],
      ...params,
      updatedAt: new Date().toISOString(),
    };

    expenses[expenseIndex] = updatedExpense;
    await this.saveExpensesToStorage(expenses);
    return updatedExpense;
  }

  async delete(id: string): Promise<void> {
    const expenses = await this.getExpensesFromStorage();
    const filteredExpenses = expenses.filter((expense) => expense.id !== id);
    await this.saveExpensesToStorage(filteredExpenses);
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(EXPENSES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing expenses from storage:', error);
      throw error;
    }
  }
}
