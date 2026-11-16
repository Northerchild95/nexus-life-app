import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { ProductivityStats } from '../../domain/entities';

type Props = {
  stats: ProductivityStats;
};

export function ProductivityCard({ stats }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="gap-4">
      <Text className="text-lg font-semibold text-ink dark:text-dark-ink">
        {t('insights.productivity')}
      </Text>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-brand-50 dark:bg-brand-900/30 p-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t('insights.tasksLabel')}
            </Text>
          </View>
          <Text className="mt-2 text-2xl font-bold text-ink dark:text-dark-ink">
            {stats.tasksCompleted}/{stats.tasksTotal}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {t('insights.tasksCompleted', { percent: stats.tasksCompletionRate.toFixed(0) })}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 p-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="leaf" size={20} color="#047857" />
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t('insights.habitsLabel')}
            </Text>
          </View>
          <Text className="mt-2 text-2xl font-bold text-ink dark:text-dark-ink">
            {stats.habitsCompleted}/{stats.habitsTotal}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {t('insights.habitsCompleted', { percent: stats.habitsCompletionRate.toFixed(0) })}
          </Text>
        </View>
      </View>

      {stats.focusSessionsCompleted > 0 && (
        <View className="rounded-2xl bg-purple-50 dark:bg-purple-900/30 p-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="time" size={20} color="#7c3aed" />
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t('insights.focusSessions')}
            </Text>
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-ink dark:text-dark-ink">
              {stats.focusSessionsCompleted}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t('insights.minutesShort', { count: stats.focusMinutesTotal })}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}
