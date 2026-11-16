import { create } from 'zustand';

import type { Expense } from '@/modules/finance/domain/entities';
import type { Task } from '@/modules/tasks/domain/entities';

/**
 * Shared source of truth for lists that can be mutated from more than one
 * screen (e.g. tasks created from the assistant modal). Zustand keeps a single
 * module-level store, so every mounted screen re-renders as soon as another
 * screen adds an item, with no navigation focus event required.
 */
type DomainDataState = {
  tasks: Task[];
  expenses: Expense[];
  setTasks: (tasks: Task[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  addTask: (task: Task) => void;
  addExpense: (expense: Expense) => void;
};

export const useDomainDataStore = create<DomainDataState>((set) => ({
  tasks: [],
  expenses: [],
  setTasks: (tasks) => set({ tasks }),
  setExpenses: (expenses) => set({ expenses }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),
}));
