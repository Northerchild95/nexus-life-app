import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { Card } from '@/core/components/Card';
import type { WeeklyTrend } from '../../domain/entities';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  trends: WeeklyTrend[];
};

export function WeeklyTrendsChart({ trends }: Props) {
  if (trends.length === 0) {
    return null;
  }

  const labels = trends.map((t) => `Sem ${t.weekNumber}`);
  const tasksData = trends.map((t) => t.tasksCompleted);
  const habitsData = trends.map((t) => t.habitsCompleted);
  const spendingData = trends.map((t) => t.totalSpent);

  return (
    <Card className="gap-4">
      <Text className="text-lg font-semibold text-ink">Tendencias Semanales</Text>

      <View>
        <Text className="mb-2 text-sm font-medium text-slate-700">Tareas y Hábitos</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: tasksData,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: habitsData,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={SCREEN_WIDTH - 100}
          height={200}
          chartConfig={{
            backgroundColor: 'transparent',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            borderRadius: 16,
          }}
        />
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-slate-700">Gastos</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: spendingData,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={SCREEN_WIDTH - 100}
          height={200}
          chartConfig={{
            backgroundColor: 'transparent',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            borderRadius: 16,
          }}
        />
      </View>
    </Card>
  );
}
