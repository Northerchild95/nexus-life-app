import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import type { DashboardFocus } from '@/modules/dashboard/domain/entities';

type Props = {
  focus: DashboardFocus;
};

export function FocusCard({ focus }: Props) {
  return (
    <Card variant="elevated" className="overflow-hidden bg-ink p-0">
      <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-500/25" />
      <View className="absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-emerald-400/10" />

      <View className="gap-5 p-5">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white/12">
                <Ionicons name="flash" color="#ffffff" size={20} />
              </View>
              <View>
                <Text className="text-xs font-semibold uppercase tracking-[1.6px] text-blue-600">
                  Focus of the day
                </Text>
                <Text className="mt-1 text-sm text-slate-600">{focus.durationLabel}</Text>
              </View>
            </View>

            <Text className="mt-5 text-3xl font-bold leading-9 text-muted">{focus.title}</Text>
            <Text className="mt-3 text-base leading-7 text-slate-600">{focus.description}</Text>
          </View>
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/8 p-4">
          <View className="flex-row gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/20">
              <Ionicons name="leaf" color="#bbf7d0" size={18} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-muted">{focus.ritualTitle}</Text>
              <Text className="mt-1 text-sm leading-6 text-slate-600">
                {focus.ritualDescription}
              </Text>
            </View>
          </View>
        </View>

        <Button label="Empezar ahora" onPress={() => {}} variant="secondary" />
      </View>
    </Card>
  );
}
