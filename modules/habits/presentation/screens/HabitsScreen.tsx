import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';

export function HabitsScreen() {
  return (
    <ScreenContainer scrollable contentClassName="gap-4">
      <Header title="Habits" subtitle="Build repeatable systems instead of relying on motivation." />

      <Card className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-muted">Current streak</Text>
            <Text className="mt-1 text-3xl font-bold text-ink">12 days</Text>
          </View>
          <View className="rounded-2xl bg-emerald-100 px-4 py-3">
            <Text className="text-sm font-semibold text-emerald-700">83% consistency</Text>
          </View>
        </View>
        <Text className="text-base leading-6 text-slate-600">
          You are strongest in morning rituals. Evening review is the habit most likely to slip.
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink">Today's habits</Text>
        {[
          ['Morning planning', 'Completed at 7:20 AM', true],
          ['Workout', 'Scheduled for 6:30 PM', false],
          ['Read 20 minutes', 'Best window: after dinner', false],
        ].map(([title, subtitle, done]) => (
          <View
            key={String(title)}
            className="flex-row items-center justify-between rounded-2xl border border-border px-4 py-4">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-ink">{title}</Text>
              <Text className="mt-1 text-sm text-slate-600">{subtitle}</Text>
            </View>
            <View
              className={`h-7 w-7 rounded-full border-2 ${
                done ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
              }`}
            />
          </View>
        ))}
      </Card>

      <View className="flex-row gap-3 mb-10">
        <Card className="flex-1 gap-2 bg-slate-900">
          <Text className="text-sm font-medium text-muted">Best time</Text>
          <Text className="text-2xl font-bold text-slate-700">7 AM</Text>
          <Text className="text-sm text-slate-700">Highest completion window</Text>
        </Card>
        <Card className="flex-1 gap-2">
          <Text className="text-sm font-medium text-muted">Friction point</Text>
          <Text className="text-2xl font-bold text-ink">Evening</Text>
          <Text className="text-sm text-slate-600">Notifications break momentum</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
