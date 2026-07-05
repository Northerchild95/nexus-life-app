import { createHabitsRepository } from '@/modules/habits/data/repositories';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { DashboardSummary } from '../../domain/entities';
import type { GetDashboardSummaryParams } from '../../domain/repositories';

export class RealDashboardDataSource {
  async getSummary(params: GetDashboardSummaryParams): Promise<DashboardSummary> {
    const tasksRepository = createTasksRepository();
    const habitsRepository = createHabitsRepository();

    const tasks = await tasksRepository.getAll();
    const habits = await habitsRepository.getAll({ status: 'active' });

    const activeTasks = tasks.filter((t) => t.status === 'pending');
    const completedTasks = tasks.filter((t) => t.status === 'completed');

    const agendaItems = [
      ...activeTasks.map((task) => ({
        id: task.id,
        title: task.title,
        meta: task.description || '',
        type: 'task' as const,
        dueLabel: task.dueDate || 'Hoy',
      })),
      ...habits.map((habit) => ({
        id: habit.id,
        title: habit.title,
        meta: `${habit.currentCount}/${habit.targetCount} - ${habit.frequency}`,
        type: 'habit' as const,
        dueLabel: habit.frequency === 'daily' ? 'Hoy' : habit.frequency === 'weekly' ? 'Esta semana' : 'Este mes',
      })),
    ];

    return {
      userName: params.userName || 'Usuario',
      date: params.date,
      focus: {
        title: 'Tu enfoque de hoy',
        durationLabel: activeTasks.length > 0 ? `${activeTasks.length} tareas` : 'Sin tareas',
        description: activeTasks.length > 0 
          ? `Tienes ${activeTasks.length} tareas pendientes` 
          : 'Sin tareas pendientes',
        ritualTitle: 'Ritual matutino',
        ritualDescription: 'Comienza tu día con propósito',
      },
      metrics: [
        {
          type: 'tasks',
          label: 'Tareas',
          value: `${completedTasks.length}/${tasks.length}`,
          caption: 'Completadas',
        },
        {
          type: 'habits',
          label: 'Hábitos',
          value: habits.length.toString(),
          caption: 'Activos',
        },
      ],
      agenda: agendaItems,
      insights: [
        {
          id: '1',
          message: activeTasks.length > 0 
            ? '¡Buen trabajo! Mantén el momentum.' 
            : '¡Excelente! No tienes tareas pendientes.',
        },
      ],
    };
  }
}
