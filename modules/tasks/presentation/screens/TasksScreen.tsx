import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';

export function TasksScreen() {
  return (
    <ScreenContainer scrollable contentClassName="gap-4">
      <Header title="Tasks" subtitle="Turn priorities into executable next steps." />

      <Card className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-muted">Execution pulse</Text>
            <Text className="mt-1 text-3xl font-bold text-ink">3 high-impact tasks</Text>
          </View>
          <View className="rounded-full bg-amber-100 px-3 py-2">
            <Text className="text-sm font-semibold text-amber-700">1 due soon</Text>
          </View>
        </View>
        <Text className="text-base leading-6 text-slate-600">
          Your workload is healthy, but one task should be pulled forward before it becomes urgent.
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink">Up next</Text>
        {[
          ['Finalize onboarding copy', 'Product', 'Today · 45 min'],
          ['Review invoice discrepancies', 'Finance', 'Today · 20 min'],
          ['Plan Sunday routine blocks', 'Personal', 'Tomorrow · 15 min'],
        ].map(([title, lane, meta]) => (
          <View key={title} className="rounded-2xl border border-border bg-slate-50 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 pr-3 text-base font-semibold text-ink">{title}</Text>
              <View className="rounded-full bg-white px-3 py-1">
                <Text className="text-xs font-semibold text-muted">{lane}</Text>
              </View>
            </View>
            <Text className="mt-2 text-sm text-slate-600">{meta}</Text>
          </View>
        ))}
      </Card>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted">Completed</Text>
          <Text className="text-2xl font-bold text-ink">7</Text>
          <Text className="text-sm text-slate-600">Across work and life</Text>
        </Card>
        <Card className="flex-1 gap-1">
          <Text className="text-sm font-medium text-muted">Delegated</Text>
          <Text className="text-2xl font-bold text-ink">2</Text>
          <Text className="text-sm text-slate-600">Still waiting for input</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
