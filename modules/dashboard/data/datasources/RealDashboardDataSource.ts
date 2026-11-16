import i18n from '@/core/i18n/i18n';
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
        dueLabel: task.dueDate || i18n.t('dashboard.today'),
      })),
      ...habits.map((habit) => ({
        id: habit.id,
        title: habit.title,
        meta: `${habit.currentCount}/${habit.targetCount} - ${i18n.t(`habits.${habit.frequency}`)}`,
        type: 'habit' as const,
        dueLabel:
          habit.frequency === 'daily'
            ? i18n.t('dashboard.today')
            : habit.frequency === 'weekly'
              ? i18n.t('dashboard.thisWeek')
              : i18n.t('dashboard.thisMonth'),
      })),
    ];

    return {
      userName: params.userName || i18n.t('dashboard.defaultUser'),
      date: params.date,
      focus: {
        id: 'daily_focus',
        title: i18n.t('dashboard.focus.defaultTitle'),
        durationLabel:
          activeTasks.length > 0
            ? i18n.t('dashboard.focus.tasksCount', { count: activeTasks.length })
            : i18n.t('dashboard.focus.noTasks'),
        duration: 25 * 60 * 1000, // 25 minutes in milliseconds
        description:
          activeTasks.length > 0
            ? i18n.t('dashboard.focus.pendingTasks', { count: activeTasks.length })
            : i18n.t('dashboard.focus.noPendingTasks'),
        ritualTitle: i18n.t('dashboard.focus.ritualTitle'),
        ritualDescription: i18n.t('dashboard.focus.ritualDescription'),
      },
      metrics: [
        {
          type: 'tasks',
          label: i18n.t('dashboard.metrics.tasks'),
          value: `${completedTasks.length}/${tasks.length}`,
          caption: i18n.t('dashboard.metrics.completed'),
        },
        {
          type: 'habits',
          label: i18n.t('dashboard.metrics.habits'),
          value: habits.length.toString(),
          caption: i18n.t('dashboard.metrics.active'),
        },
      ],
      agenda: agendaItems,
      insights: [
        {
          id: '1',
          message:
            activeTasks.length > 0
              ? i18n.t('dashboard.focus.goodJob')
              : i18n.t('dashboard.focus.allDone'),
        },
      ],
    };
  }
}
