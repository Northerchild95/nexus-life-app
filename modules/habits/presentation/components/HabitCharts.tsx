import { Dimensions, ScrollView, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

import { Card } from '@/core/components/Card';

const screenWidth = Dimensions.get('window').width;

export function HabitCharts({ habits }: { habits: Array<{ title: string; currentCount: number; targetCount: number }> }) {
  if (habits.length === 0) {
    return null;
  }

  const habitLabels = habits.map((h) => h.title.substring(0, 10));
  const habitProgress = habits.map((h) => Math.round((h.currentCount / h.targetCount) * 100));

  // Weekly consistency data (simulated for now)
  const weeklyData = [60, 75, 80, 65, 90, 85, 70];
  const weekLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-4" style={{ width: screenWidth * 1.5 }}>
        {/* Progress Chart */}
        <Card className="flex-1 gap-3 p-4">
          <Text className="text-lg font-semibold text-ink">Progreso hoy</Text>
          <BarChart
            data={{
              labels: habitLabels,
              datasets: [
                {
                  data: habitProgress,
                },
              ],
            }}
            width={screenWidth * 0.7}
            height={200}
            chartConfig={chartConfig}
            withInnerLines={false}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel="%"
            yAxisSuffix=""
          />
          <Text className="text-sm text-slate-600 text-center">
            Porcentaje de completación por hábito
          </Text>
        </Card>

        {/* Weekly Consistency Chart */}
        <Card className="flex-1 gap-3 p-4">
          <Text className="text-lg font-semibold text-ink">Consistencia semanal</Text>
          <LineChart
            data={{
              labels: weekLabels,
              datasets: [
                {
                  data: weeklyData,
                },
              ],
            }}
            width={screenWidth * 0.7}
            height={200}
            chartConfig={chartConfig}
            withDots={true}
            withInnerLines={false}
            withOuterLines={false}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text className="text-sm text-slate-600 text-center">
            Tendencia de hábitos completados esta semana
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}
