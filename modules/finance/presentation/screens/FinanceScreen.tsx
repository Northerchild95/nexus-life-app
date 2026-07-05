import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';

export function FinanceScreen() {
  return (
    <ScreenContainer scrollable contentClassName="gap-4">
      <Header title="Finance" subtitle="Make spending visible and intentional." />

      <Card className="gap-4 bg-slate-900">
        <Text className="text-sm font-medium uppercase tracking-wide text-muted">Monthly overview</Text>
        <Text className="text-3xl font-bold text-slate-600">$2,430 available</Text>
        <Text className="text-base leading-6 text-slate-600">
          Essentials are covered. Variable spending is slightly above your target this week.
        </Text>
      </Card>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-2">
          <Text className="text-sm font-medium text-muted">Saved</Text>
          <Text className="text-2xl font-bold text-ink">$640</Text>
          <Text className="text-sm text-emerald-700">+12% vs last month</Text>
        </Card>
        <Card className="flex-1 gap-2">
          <Text className="text-sm font-medium text-muted">Spent</Text>
          <Text className="text-2xl font-bold text-ink">$1,780</Text>
          <Text className="text-sm text-amber-700">Dining out is trending high</Text>
        </Card>
      </View>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink">Recent movements</Text>
        {[
          ['Groceries', '-$84', 'Planned'],
          ['Salary', '+$2,900', 'Income'],
          ['Subscriptions', '-$24', 'Recurring'],
        ].map(([label, amount, tag]) => (
          <View
            key={label}
            className="flex-row items-center justify-between rounded-2xl border border-border px-4 py-4">
            <View>
              <Text className="text-base font-semibold text-ink">{label}</Text>
              <Text className="mt-1 text-sm text-slate-600">{tag}</Text>
            </View>
            <Text className={`text-base font-bold ${amount.startsWith('+') ? 'text-emerald-700' : 'text-ink'}`}>
              {amount}
            </Text>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}
