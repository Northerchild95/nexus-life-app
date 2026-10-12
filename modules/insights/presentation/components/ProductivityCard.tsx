import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { ProductivityStats } from '../../domain/entities';

type Props = {
  stats: ProductivityStats;
};

export function ProductivityCard({ stats }: Props) {
  return (
    <Card className="gap-4">
      <Text className="text-lg font-semibold text-ink">Productividad</Text>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-brand-50 p-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
            <Text className="text-sm font-medium text-slate-600">Tareas</Text>
          </View>
          <Text className="mt-2 text-2xl font-bold text-ink">
            {stats.tasksCompleted}/{stats.tasksTotal}
          </Text>
          <Text className="text-sm text-slate-500">{stats.tasksCompletionRate.toFixed(0)}% completadas</Text>
        </View>

        <View className="flex-1 rounded-2xl bg-emerald-50 p-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="leaf" size={20} color="#047857" />
            <Text className="text-sm font-medium text-slate-600">Hábitos</Text>
          </View>
          <Text className="mt-2 text-2xl font-bold text-ink">
            {stats.habitsCompleted}/{stats.habitsTotal}
          </Text>
          <Text className="text-sm text-slate-500">{stats.habitsCompletionRate.toFixed(0)}% cumplidos</Text>
        </View>
      </View>

      {stats.focusSessionsCompleted > 0 && (
        <View className="rounded-2xl bg-purple-50 p-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="time" size={20} color="#7c3aed" />
            <Text className="text-sm font-medium text-slate-600">Focus Sessions</Text>
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-ink">{stats.focusSessionsCompleted}</Text>
            <Text className="text-sm text-slate-500">{stats.focusMinutesTotal} min</Text>
          </View>
        </View>
      )}
    </Card>
  );
}
