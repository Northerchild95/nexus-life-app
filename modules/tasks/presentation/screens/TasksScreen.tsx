import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';

export function TasksScreen() {
  const { t } = useTranslation();

  const upNext = [
    [t('tasks.demoOnboarding'), t('tasks.laneProduct'), t('tasks.durationToday', { minutes: 45 })],
    [t('tasks.demoInvoice'), t('tasks.laneFinance'), t('tasks.durationToday', { minutes: 20 })],
    [t('tasks.demoRoutine'), t('tasks.lanePersonal'), t('tasks.durationTomorrow', { minutes: 15 })],
  ];

  return (
    <ScreenContainer scrollable contentClassName="gap-4 mb-8">
      <Header title={t('tasks.title')} subtitle={t('tasks.subtitle')} />

      <Card className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-muted dark:text-dark-muted">
              {t('tasks.executionPulse')}
            </Text>
            <Text className="mt-1 text-3xl font-bold text-ink dark:text-dark-ink">
              {t('tasks.highImpact', { count: 3 })}
            </Text>
          </View>
          <View className="rounded-full bg-amber-100 px-3 py-2">
            <Text className="text-sm font-semibold text-amber-700">
              {t('tasks.dueSoonCount', { count: 1 })}
            </Text>
          </View>
        </View>
        <Text className="text-base leading-6 text-slate-600 dark:text-slate-400">
          {t('tasks.workloadHealthy')}
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-dark-ink">{t('tasks.upNext')}</Text>
        {upNext.map(([title, lane, meta]) => (
          <View key={title} className="rounded-2xl border border-border bg-slate-50 dark:bg-dark-surface-soft px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 pr-3 text-base font-semibold text-ink dark:text-dark-ink">{title}</Text>
              <View className="rounded-full bg-white dark:bg-dark-surface px-3 py-1">
                <Text className="text-xs font-semibold text-muted dark:text-dark-muted">{lane}</Text>
              </View>
            </View>
            <Text className="mt-2 text-sm text-slate-600 dark:text-slate-400">{meta}</Text>
          </View>
        ))}
      </Card>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted dark:text-dark-muted">
            {t('tasks.completedStat')}
          </Text>
          <Text className="text-2xl font-bold text-ink dark:text-dark-ink">7</Text>
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            {t('tasks.completedCaption')}
          </Text>
        </Card>
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted dark:text-dark-muted">
            {t('tasks.delegated')}
          </Text>
          <Text className="text-2xl font-bold text-ink dark:text-dark-ink">2</Text>
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            {t('tasks.delegatedCaption')}
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
