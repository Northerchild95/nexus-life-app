import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { Achievement } from '../../domain/entities';

type Props = {
  achievements: Achievement[];
};

export function AchievementsCard({ achievements }: Props) {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <Card className="gap-4">
      <Text className="text-lg font-semibold text-ink">Logros</Text>

      <View className="flex-row flex-wrap gap-3">
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            className={`flex-1 min-w-[45%] rounded-2xl border p-4 ${
              achievement.unlocked ? 'border-amber-400 bg-amber-50' : 'border-border bg-slate-50'
            }`}>
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={achievement.icon as any}
                size={24}
                color={achievement.unlocked ? '#f59e0b' : '#9ca3af'}
              />
              <Text
                className={`flex-1 text-sm font-semibold ${
                  achievement.unlocked ? 'text-amber-900' : 'text-slate-500'
                }`}
                numberOfLines={1}
                ellipsizeMode="tail">
                {achievement.title}
              </Text>
            </View>
            <Text
              className={`mt-2 text-xs ${
                achievement.unlocked ? 'text-amber-700' : 'text-slate-400'
              }`}
              numberOfLines={2}
              ellipsizeMode="tail">
              {achievement.description}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
