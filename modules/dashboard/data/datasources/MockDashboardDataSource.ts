import type {
    DashboardAgendaItem,
    DashboardFocus,
    DashboardInsight,
    DashboardMetric,
    DashboardSummary,
} from '@/modules/dashboard/domain/entities';
import type { GetDashboardSummaryParams } from '@/modules/dashboard/domain/repositories';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { Task } from '@/modules/tasks/domain/entities';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockDashboardDataSource {
  private tasksRepository = createTasksRepository();

  async getSummary({ userName, date }: GetDashboardSummaryParams): Promise<DashboardSummary> {
    await wait(250);

    const tasks = await this.tasksRepository.getAll({ status: 'pending' });
    const agenda = this.getAgendaFromTasks(tasks, date);

    return {
      userName,
      date,
      focus: this.getFocus(),
      metrics: this.getMetrics(tasks),
      agenda,
      insights: this.getInsights(),
    };
  }

  private getFocus(): DashboardFocus {
    return {
      id: 'focus-weekly-plan',
      title: 'Finalizar el plan de trabajo semanal',
      durationLabel: '90 min',
      duration: 90 * 60 * 1000, // 90 minutes in milliseconds
      description:
        'Cierra este bloque antes del mediodia y deja el resto del dia con menos friccion.',
      ritualTitle: 'Ritual recomendado',
      ritualDescription:
        'Planea 5 minutos, silencia interrupciones y entra al bloque principal sin cambiar de contexto.',
    };
  }

  private getMetrics(tasks: Task[] = []): DashboardMetric[] {
    const pendingTasksCount = tasks.length;
    return [
      {
        type: 'habits',
        label: 'Habits',
        value: '5/6',
        caption: 'Uno pendiente',
      },
      {
        type: 'tasks',
        label: 'Tasks',
        value: pendingTasksCount.toString(),
        caption: pendingTasksCount === 1 ? '1 prioridad activa' : `${pendingTasksCount} prioridades activas`,
      },
      {
        type: 'budget',
        label: 'Budget',
        value: '72%',
        caption: 'Bajo control',
      },
    ];
  }

  private getAgendaFromTasks(tasks: Task[], date: string): DashboardAgendaItem[] {
    const taskItems: DashboardAgendaItem[] = tasks
      .filter((task) => task.dueDate === date)
      .map((task) => ({
        id: task.id,
        type: 'task' as const,
        title: task.title,
        meta: `Trabajo · ${task.priority}`,
        dueLabel: 'Hoy',
      }));

    if (taskItems.length === 0) {
      return this.getFallbackAgenda();
    }

    return taskItems;
  }

  private getFallbackAgenda(): DashboardAgendaItem[] {
    return [
      {
        id: 'agenda-habit-strength-training',
        type: 'habit',
        title: 'Entrenamiento de fuerza',
        meta: 'Habito · 6:30 PM',
        dueLabel: 'Hoy',
      },
      {
        id: 'agenda-finance-weekend-expenses',
        type: 'finance',
        title: 'Registrar gastos del fin de semana',
        meta: 'Finanzas · 8:00 PM',
        dueLabel: 'Hoy',
      },
    ];
  }

  private getInsights(): DashboardInsight[] {
    return [
      {
        id: 'insight-focus-window',
        message: 'Tu mejor ventana de enfoque vuelve a ser la manana.',
      },
      {
        id: 'insight-habit-streak',
        message: 'Solo te falta un habito para cerrar el streak del dia.',
      },
      {
        id: 'insight-budget-balance',
        message: 'Tu presupuesto sigue sano, pero ocio ya va por encima de la media semanal.',
      },
    ];
  }
}
