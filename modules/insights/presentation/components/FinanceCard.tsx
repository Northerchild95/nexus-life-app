import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { FinanceStats } from '../../domain/entities';

type Props = {
  stats: FinanceStats;
};

export function FinanceCard({ stats }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="gap-4">
      <Text className="text-lg font-semibold text-ink dark:text-dark-ink">
        {t('insights.financeToday')}
      </Text>

      <View className="rounded-2xl bg-slate-900 p-4">
        <Text className="text-sm font-medium uppercase tracking-wide text-slate-400">
          {t('insights.totalSpent')}
        </Text>
        <Text className="mt-1 text-3xl font-bold text-white">${stats.totalSpent.toFixed(2)}</Text>
        <View className="mt-2 flex-row items-center gap-2">
          <Text className="text-sm text-slate-400">
            {t('insights.expensesCount', { count: stats.expenseCount })}
          </Text>
          {stats.verifiedExpenses > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text className="text-sm text-emerald-400">
                {t('insights.verifiedCount', { count: stats.verifiedExpenses })}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-border p-4">
          <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t('insights.average')}
          </Text>
          <Text className="mt-1 text-xl font-bold text-ink dark:text-dark-ink">
            ${stats.averageExpense.toFixed(2)}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl border border-border p-4">
          <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t('insights.topCategory')}
          </Text>
          <Text className="mt-1 text-xl font-bold text-ink dark:text-dark-ink" numberOfLines={1}>
            {stats.topCategory}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            ${stats.topCategoryAmount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
