export type DashboardMetricType = 'habits' | 'tasks' | 'budget';

export type DashboardMetric = {
  type: DashboardMetricType;
  label: string;
  value: string;
  caption: string;
};

export type DashboardFocus = {
  id: string;
  title: string;
  durationLabel: string;
  duration: number; // in milliseconds
  description: string;
  ritualTitle: string;
  ritualDescription: string;
};

export type DashboardAgendaItemType = 'task' | 'habit' | 'finance';

export type DashboardAgendaItem = {
  id: string;
  type: DashboardAgendaItemType;
  title: string;
  meta: string;
  dueLabel: string;
};

export type DashboardInsight = {
  id: string;
  message: string;
};

export type DashboardSummary = {
  userName?: string;
  date: string;
  focus: DashboardFocus;
  metrics: DashboardMetric[];
  agenda: DashboardAgendaItem[];
  insights: DashboardInsight[];
};
