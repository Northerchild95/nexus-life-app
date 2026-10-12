import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { HabitCharts } from '../components';
import { useHabitActions, useHabitsWithAutoReload } from '../hooks';

export function HabitsScreen() {
  const { loadHabits, habits, isLoading } = useHabitsWithAutoReload();
  const { completeHabit, isLoading: isCompleting } = useHabitActions();

  const today = new Date().toISOString().split('T')[0];

  const completedToday = habits.filter((h) => h.lastCompletedDate === today).length;
  const totalHabits = habits.length;
  const consistency = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleCompleteHabit = async (habitId: string) => {
    try {
      await completeHabit(habitId);
      await loadHabits();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const renderHabit = ({ item: habit }: { item: any }) => {
    const isCompletedToday = habit.lastCompletedDate === today;
    const isGoalReached = habit.currentCount >= habit.targetCount;
    const progress = Math.min((habit.currentCount / habit.targetCount) * 100, 100);

    return (
      <View className="flex-row items-center justify-between rounded-2xl border border-border px-4 py-4">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-ink">{habit.title}</Text>
          <Text className="mt-1 text-sm text-slate-600">
            {habit.currentCount}/{habit.targetCount} daily ({Math.round(progress)}%)
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleCompleteHabit(habit.id)}
          disabled={isGoalReached || isCompleting}
          className={`h-7 w-7 rounded-full border-2 ${
            isGoalReached ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
          } ${isGoalReached || isCompleting ? 'opacity-50' : ''}`}
        />
      </View>
    );
  };

  return (
    <ScreenContainer scrollable contentClassName="gap-4">
      <Header title="Habits" subtitle="Build repeatable systems instead of relying on motivation." />

      <Card className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-muted">Completed today</Text>
            <Text className="mt-1 text-3xl font-bold text-ink">
              {completedToday}/{totalHabits}
            </Text>
          </View>
          <View className="rounded-2xl bg-emerald-100 px-4 py-3">
            <Text className="text-sm font-semibold text-emerald-700">{consistency}% consistency</Text>
          </View>
        </View>
        <Text className="text-base leading-6 text-slate-600">
          {totalHabits === 0
            ? 'No habits yet. Create your first habit to start building streaks!'
            : 'Keep up the momentum. Consistency builds habits.'}
        </Text>
      </Card>

      <HabitCharts habits={habits} />

      <Card className="gap-3 mb-12">
        <Text className="text-lg font-semibold text-ink">Today's habits</Text>
        {habits.length === 0 ? (
          <Text className="text-sm text-slate-600">No habits created yet.</Text>
        ) : (
          <FlatList
            data={habits}
            renderItem={renderHabit}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </Card>
    </ScreenContainer>
  );
}
