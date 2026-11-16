import { Dimensions, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BarChart, LineChart } from 'react-native-chart-kit';

import { Card } from '@/core/components/Card';
import { useIsDarkMode } from '@/core/theme/useThemeSync';

const screenWidth = Dimensions.get('window').width;

export function HabitCharts({ habits }: { habits: Array<{ title: string; currentCount: number; targetCount: number }> }) {
  const { t } = useTranslation();
  const isDark = useIsDarkMode();

  if (habits.length === 0) {
    return null;
  }

  const habitLabels = habits.map(() => '');
  const habitProgress = habits.map((h) => Math.round((h.currentCount / h.targetCount) * 100));

  // Weekly consistency data (simulated for now)
  const weeklyData = [60, 75, 80, 65, 90, 85, 70];
  const weekLabels = [
    t('habits.weekdays.mon'),
    t('habits.weekdays.tue'),
    t('habits.weekdays.wed'),
    t('habits.weekdays.thu'),
    t('habits.weekdays.fri'),
    t('habits.weekdays.sat'),
    t('habits.weekdays.sun'),
  ];

  const chartConfig = {
    backgroundColor: isDark ? '#242730' : '#ffffff',
    backgroundGradientFrom: isDark ? '#242730' : '#ffffff',
    backgroundGradientTo: isDark ? '#242730' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) =>
      isDark ? `rgba(134, 176, 255, ${opacity})` : `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) =>
      isDark ? `rgba(156, 163, 175, ${opacity})` : `rgba(71, 85, 105, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-4" style={{ width: screenWidth * 1.5 }}>
        {/* Progress Chart */}
        <Card className="flex-1 gap-3 p-1">
          <Text className="text-lg font-semibold text-ink dark:text-dark-ink">{t('habits.progressChartTitle')}</Text>
          <BarChart
             data={{
                labels: habitLabels,
                datasets: [
                  {
                    data: habitProgress,
                  },
                ],
              }}
            width={screenWidth * 0.6}
            height={200}
            chartConfig={chartConfig}
            withInnerLines={false}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel="%"
            yAxisSuffix=""
            style={{
              paddingTop: 16,
              paddingRight: 35,
            }}
          />
          <Text className="text-sm text-slate-600 dark:text-slate-400 text-center">
            {t('habits.progressChartCaption')}
          </Text>
        </Card>

        {/* Weekly Consistency Chart */}
        <Card className="flex-1 gap-3 p-4">
          <Text className="text-lg font-semibold text-ink dark:text-dark-ink">{t('habits.weeklyChartTitle')}</Text>
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
            yLabelsOffset={30}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingTop: 16,
              paddingRight: 45,
            }}
          />
          <Text className="text-sm text-slate-600 dark:text-slate-400 text-center">
            {t('habits.weeklyChartCaption')}
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}
