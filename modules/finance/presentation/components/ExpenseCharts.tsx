import { Dimensions, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import { Card } from '@/core/components/Card';
import type { Expense, ExpenseCategory } from '../../domain/entities';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Comida',
  transport: 'Transporte',
  entertainment: 'Entretenimiento',
  shopping: 'Compras',
  health: 'Salud',
  bills: 'Facturas',
  education: 'Educación',
  other: 'Otros',
  custom: 'Personalizada',
};

const CHART_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // green
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#6b7280', // gray
  '#6366f1', // indigo
];

type Props = {
  expenses: Expense[];
};

export function ExpenseCharts({ expenses }: Props) {
  if (expenses.length === 0) {
    return null;
  }

  // Calculate totals by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category === 'custom' && expense.customCategory
      ? expense.customCategory
      : CATEGORY_LABELS[expense.category];
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([category, amount], index) => ({
    name: category,
    amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return (
    <Card className="gap-4">
      <Text className="text-lg font-semibold text-ink">Desglose por categoría</Text>

      <View className="items-center">
        <PieChart
          data={chartData}
          width={SCREEN_WIDTH - 100}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
          style={{
            borderRadius: 16,
          }}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-slate-700">Detalle:</Text>
        {chartData.map((item) => {
          const percentage = ((item.amount / totalAmount) * 100).toFixed(1);
          return (
            <View key={item.name} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-sm text-slate-700">{item.name}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm font-semibold text-slate-700">${item.amount.toFixed(2)}</Text>
                <Text className="text-sm text-slate-500">{percentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View className="border-t border-border pt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-ink">Total</Text>
          <Text className="text-lg font-bold text-ink">${totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </Card>
  );
}
