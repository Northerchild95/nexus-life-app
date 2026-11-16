import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { AchievementsCard, FinanceCard, ProductivityCard, WeeklyTrendsChart } from '@/modules/insights/presentation/components';
import { useInsights } from '@/modules/insights/presentation/hooks';

export function InsightsPanel() {
  const { t } = useTranslation();
  const { insight, isLoading, isError } = useInsights();

  const dailyInsights = [
    t('dashboard.insightsPanel.daily1'),
    t('dashboard.insightsPanel.daily2'),
    t('dashboard.insightsPanel.daily3'),
  ];

  if (isLoading) {
    return (
      <View className="gap-3 pb-32">
        <Text className="text-xl font-semibold text-ink dark:text-dark-ink">{t('insights.title')}</Text>
        <Card className="items-center justify-center py-8">
          <Text className="text-slate-600 dark:text-slate-400">
            {t('dashboard.insightsPanel.loading')}
          </Text>
        </Card>
      </View>
    );
  }

  if (isError || !insight) {
    return (
      <View className="gap-3 pb-32">
        <Text className="text-xl font-semibold text-ink dark:text-dark-ink">{t('insights.title')}</Text>
        <Card className="items-center justify-center py-8">
          <Text className="text-slate-600 dark:text-slate-400">
            {t('dashboard.insightsPanel.error')}
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="gap-4 pb-32">
      <Text className="text-xl font-semibold text-ink dark:text-dark-ink">{t('insights.title')}</Text>

      <Card variant="tinted" className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-600">
            <Ionicons name="sparkles" color="#ffffff" size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-ink dark:text-dark-ink">
              {t('dashboard.insightsPanel.dailyTitle')}
            </Text>
            <Text className="text-sm text-muted dark:text-dark-muted">
              {t('dashboard.insightsPanel.dailySubtitle')}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          {dailyInsights.map((dailyInsight) => (
            <View key={dailyInsight} className="flex-row gap-3 rounded-2xl bg-white/70 dark:bg-dark-surface-soft px-3 py-3">
              <View className="mt-1 h-7 w-7 items-center justify-center rounded-full bg-brand-100">
                <Ionicons name="chevron-forward" color="#1d4ed8" size={14} />
              </View>
              <Text className="flex-1 text-sm leading-6 text-ink dark:text-dark-ink">{dailyInsight}</Text>
            </View>
          ))}
        </View>
      </Card>

      <ProductivityCard stats={insight.productivity} />
      <FinanceCard stats={insight.finance} />
      <WeeklyTrendsChart trends={insight.weeklyTrends} />
      <AchievementsCard achievements={insight.achievements} />
    </View>
  );
}
