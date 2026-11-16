import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { useResolvedColorScheme } from '@/core/theme/useThemeSync';
import type { Task } from '@/modules/tasks/domain/entities';
import { useTasks } from '@/modules/tasks/presentation/hooks';

const pad = (value: number) => `${value}`.padStart(2, '0');

const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDay = (value: string) => {
  const day = value.slice(0, 10);
  const parsed = new Date(`${day}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function TasksScreen() {
  const { t, i18n } = useTranslation();
  const isDark = useResolvedColorScheme() === 'dark';
  const { tasks, isLoading, error, loadTasks } = useTasks();

  const stats = useMemo(() => {
    const highPriorityTasks = tasks.filter(
      (task) => task.priority === 'high' && task.status !== 'completed',
    );
    const completedTasks = tasks.filter((task) => task.status === 'completed');
    const pendingTasks = tasks.filter(
      (task) => task.status === 'pending' || task.status === 'in_progress',
    );

    const today = new Date();
    const todayKey = toDayKey(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = toDayKey(tomorrow);

    const dueSoonTasks = pendingTasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueKey = task.dueDate.slice(0, 10);
      return dueKey === todayKey || dueKey === tomorrowKey;
    });

    return {
      highPriorityCount: highPriorityTasks.length,
      dueSoonCount: dueSoonTasks.length,
      completedCount: completedTasks.length,
      pendingCount: pendingTasks.length,
    };
  }, [tasks]);

  const upNext = useMemo(
    () => tasks.filter((task) => task.status !== 'completed').slice(0, 5),
    [tasks],
  );

  const getPriorityLabel = (priority: Task['priority']) => t(`tasks.${priority}`);

  const getStatusLabel = (status: Task['status']) =>
    status === 'in_progress' ? t('tasks.inProgress') : t(`tasks.${status}`);

  const getDueDateLabel = (dueDate?: string) => {
    if (!dueDate) return t('tasks.noDueDate');

    const date = parseDay(dueDate);
    if (!date) return dueDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return t('tasks.today');
    if (date.getTime() === tomorrow.getTime()) return t('tasks.tomorrow');

    return date.toLocaleDateString(i18n.language.startsWith('es') ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading && tasks.length === 0) {
    return (
      <ScreenContainer scrollable contentClassName="gap-4 mb-8">
        <Header title={t('tasks.title')} subtitle={t('tasks.subtitle')} />
        <Card className="items-center gap-3 py-8">
          <ActivityIndicator color={isDark ? '#86b0ff' : '#1d4ed8'} />
          <Text className="text-base font-medium text-muted dark:text-dark-muted">
            {t('common.loading')}
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <ScreenContainer scrollable contentClassName="gap-4 mb-8">
        <Header title={t('tasks.title')} subtitle={t('tasks.subtitle')} />
        <Card className="gap-3">
          <Text className="text-base font-semibold text-ink dark:text-dark-ink">
            {t('tasks.errorLoading')}
          </Text>
          <Text className="text-sm leading-6 text-muted dark:text-dark-muted">{error}</Text>
          <Button
            label={t('common.retry')}
            onPress={loadTasks}
            variant="secondary"
          />
        </Card>
      </ScreenContainer>
    );
  }

  if (tasks.length === 0) {
    return (
      <ScreenContainer scrollable contentClassName="gap-4 mb-8">
        <Header title={t('tasks.title')} subtitle={t('tasks.subtitle')} />
        <Card>
          <Text className="text-base leading-6 text-muted dark:text-dark-muted">
            {t('tasks.empty')}
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentClassName="gap-4 mb-8">
      <Header title={t('tasks.title')} subtitle={t('tasks.subtitle')} />

      <Card className="gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-sm font-medium text-muted dark:text-dark-muted">
              {t('tasks.executionPulse')}
            </Text>
            <Text className="mt-1 text-3xl font-bold text-ink dark:text-dark-ink">
              {t('tasks.highImpact', { count: stats.highPriorityCount })}
            </Text>
          </View>
          {stats.dueSoonCount > 0 ? (
            <View className="rounded-full bg-amber-100 px-3 py-2 dark:bg-amber-900/30">
              <Text className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {t('tasks.dueSoonCount', { count: stats.dueSoonCount })}
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="text-base leading-6 text-slate-600 dark:text-slate-400">
          {stats.dueSoonCount > 0
            ? t('tasks.workloadDueSoon', { count: stats.dueSoonCount })
            : t('tasks.workloadClear')}
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-dark-ink">
          {t('tasks.upNext')}
        </Text>
        {upNext.length === 0 ? (
          <Text className="text-sm leading-6 text-muted dark:text-dark-muted">
            {t('tasks.noUpNext')}
          </Text>
        ) : (
          upNext.map((task) => (
            <View
              key={task.id}
              className="rounded-2xl border border-border bg-slate-50 px-4 py-4 dark:border-dark-border dark:bg-dark-surface-soft">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="flex-1 pr-3 text-base font-semibold text-ink dark:text-dark-ink">
                  {task.title}
                </Text>
                <View className="rounded-full bg-white px-3 py-1 dark:bg-dark-surface">
                  <Text className="text-xs font-semibold text-muted dark:text-dark-muted">
                    {getPriorityLabel(task.priority)}
                  </Text>
                </View>
              </View>
              <View className="mt-2 flex-row items-center gap-2">
                <Text className="text-sm text-slate-600 dark:text-slate-400">
                  {getStatusLabel(task.status)}
                </Text>
                <Text className="text-sm text-slate-400 dark:text-slate-500">·</Text>
                <Text className="text-sm text-slate-600 dark:text-slate-400">
                  {getDueDateLabel(task.dueDate)}
                </Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted dark:text-dark-muted">
            {t('tasks.completedStat')}
          </Text>
          <Text className="text-2xl font-bold text-ink dark:text-dark-ink">
            {stats.completedCount}
          </Text>
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            {t('tasks.completedCaption')}
          </Text>
        </Card>
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted dark:text-dark-muted">
            {t('tasks.pending')}
          </Text>
          <Text className="text-2xl font-bold text-ink dark:text-dark-ink">
            {stats.pendingCount}
          </Text>
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            {t('tasks.pendingCaption')}
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
