import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { AchievementsCard, FinanceCard, ProductivityCard, WeeklyTrendsChart } from '@/modules/insights/presentation/components';
import { useInsights } from '@/modules/insights/presentation/hooks';

const dailyInsights = [
  'Tu mejor ventana de enfoque vuelve a ser la mañana.',
  'Solo te falta un hábito para cerrar el streak del día.',
  'Tu presupuesto sigue sano, pero ocio ya va por encima de la media semanal.',
] as const;

export function InsightsPanel() {
  const { insight, isLoading, isError } = useInsights();

  if (isLoading) {
    return (
      <View className="gap-3 pb-32">
        <Text className="text-xl font-semibold text-ink">Insights</Text>
        <Card className="items-center justify-center py-8">
          <Text className="text-slate-600">Cargando insights...</Text>
        </Card>
      </View>
    );
  }

  if (isError || !insight) {
    return (
      <View className="gap-3 pb-32">
        <Text className="text-xl font-semibold text-ink">Insights</Text>
        <Card className="items-center justify-center py-8">
          <Text className="text-slate-600">No se pudieron cargar los insights</Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="gap-4 pb-32">
      <Text className="text-xl font-semibold text-ink">Insights</Text>

      <Card variant="tinted" className="gap-4 border-brand-100 bg-brand-50/70">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-600">
            <Ionicons name="sparkles" color="#ffffff" size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-ink">Lectura del día</Text>
            <Text className="text-sm text-muted">Pequeñas señales para decidir mejor.</Text>
          </View>
        </View>

        <View className="gap-3">
          {dailyInsights.map((insight) => (
            <View key={insight} className="flex-row gap-3 rounded-2xl bg-white/70 px-3 py-3">
              <View className="mt-1 h-7 w-7 items-center justify-center rounded-full bg-brand-100">
                <Ionicons name="chevron-forward" color="#1d4ed8" size={14} />
              </View>
              <Text className="flex-1 text-sm leading-6 text-ink">{insight}</Text>
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
