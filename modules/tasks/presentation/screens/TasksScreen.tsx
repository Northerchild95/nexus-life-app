import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { useTasks } from '@/modules/tasks/presentation/hooks';
import type { Task } from '@/modules/tasks/domain/entities';

export function TasksScreen() {
  const { tasks, isLoading } = useTasks();

  const stats = useMemo(() => {
    const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed');
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');

    // Tasks due soon (within 24 hours)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dueSoonTasks = pendingTasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate <= tomorrow && dueDate >= now;
    });

    return {
      highPriorityCount: highPriorityTasks.length,
      dueSoonCount: dueSoonTasks.length,
      completedCount: completedTasks.length,
      pendingCount: pendingTasks.length,
    };
  }, [tasks]);

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
    }
  };

  const getDueDateLabel = (dueDate?: string) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <ScreenContainer scrollable contentClassName="gap-4 mb-8">
        <Header title="Tasks" subtitle="Turn priorities into executable next steps." />
        <Card>
          <Text className="text-slate-600">Loading tasks...</Text>
        </Card>
      </ScreenContainer>
    );
  }

  if (tasks.length === 0) {
    return (
      <ScreenContainer scrollable contentClassName="gap-4 mb-8">
        <Header title="Tasks" subtitle="Turn priorities into executable next steps." />
        <Card>
          <Text className="text-slate-600">No tasks yet. Create your first task!</Text>
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentClassName="gap-4 mb-8">
      <Header title="Tasks" subtitle="Turn priorities into executable next steps." />

      <Card className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-muted">Execution pulse</Text>
            <Text className="mt-1 text-3xl font-bold text-ink">
              {stats.highPriorityCount} high-impact task{stats.highPriorityCount !== 1 ? 's' : ''}
            </Text>
          </View>
          {stats.dueSoonCount > 0 && (
            <View className="rounded-full bg-amber-100 px-3 py-2">
              <Text className="text-sm font-semibold text-amber-700">
                {stats.dueSoonCount} due soon
              </Text>
            </View>
          )}
        </View>
        <Text className="text-base leading-6 text-slate-600">
          {stats.dueSoonCount > 0
            ? `You have ${stats.dueSoonCount} task${stats.dueSoonCount !== 1 ? 's' : ''} that should be pulled forward before it becomes urgent.`
            : 'Your workload is healthy. Keep up the good work!'}
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink">Up next</Text>
        {tasks
          .filter((t) => t.status !== 'completed')
          .slice(0, 5)
          .map((task) => (
            <View key={task.id} className="rounded-2xl border border-border bg-slate-50 px-4 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 pr-3 text-base font-semibold text-ink">{task.title}</Text>
                <View className="rounded-full bg-white px-3 py-1">
                  <Text className="text-xs font-semibold text-muted">{getPriorityLabel(task.priority)}</Text>
                </View>
              </View>
              <View className="mt-2 flex-row items-center gap-2">
                <Text className="text-sm text-slate-600">{getStatusLabel(task.status)}</Text>
                <Text className="text-sm text-slate-400">·</Text>
                <Text className="text-sm text-slate-600">{getDueDateLabel(task.dueDate)}</Text>
              </View>
            </View>
          ))}
      </Card>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted">Completed</Text>
          <Text className="text-2xl font-bold text-ink">{stats.completedCount}</Text>
          <Text className="text-sm text-slate-600">Across work and life</Text>
        </Card>
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted">Pending</Text>
          <Text className="text-2xl font-bold text-ink">{stats.pendingCount}</Text>
          <Text className="text-sm text-slate-600">Still in progress</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
