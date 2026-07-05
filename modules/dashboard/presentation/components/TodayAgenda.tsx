import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { DashboardAgendaItem } from '@/modules/dashboard/domain/entities';

type Props = {
  items: DashboardAgendaItem[];
  onCompleteTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onEditTask?: (id: string) => void;
  onCompleteHabit?: (id: string) => void;
  onDeleteHabit?: (id: string) => void;
  onEditHabit?: (id: string) => void;
};

const getAccentForType = (type: DashboardAgendaItem['type']) => {
  switch (type) {
    case 'task':
      return 'bg-brand-100 text-brand-700';
    case 'habit':
      return 'bg-emerald-100 text-emerald-700';
    case 'finance':
      return 'bg-amber-100 text-amber-700';
  }
};

export function TodayAgenda({ items, onCompleteTask, onDeleteTask, onEditTask, onCompleteHabit, onDeleteHabit, onEditHabit }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-xl font-semibold text-ink">Agenda de hoy</Text>
      <Card className="gap-3">
        {items.map((item) => (
          <View
            key={item.id}
            className="rounded-3xl border border-border bg-surfaceSoft px-4 py-4">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-semibold text-ink">{item.title}</Text>
                <Text className="mt-1 text-sm text-muted">{item.meta}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                {item.type === 'task' && (
                  <>
                    {onCompleteTask && (
                      <Pressable
                        onPress={() => onCompleteTask(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                        <Ionicons name="checkmark" color="#047857" size={16} />
                      </Pressable>
                    )}
                    {onEditTask && (
                      <Pressable
                        onPress={() => onEditTask(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-brand-100">
                        <Ionicons name="create" color="#1d4ed8" size={16} />
                      </Pressable>
                    )}
                    {onDeleteTask && (
                      <Pressable
                        onPress={() => onDeleteTask(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <Ionicons name="trash" color="#dc2626" size={16} />
                      </Pressable>
                    )}
                  </>
                )}
                {item.type === 'habit' && (
                  <>
                    {onCompleteHabit && (
                      <Pressable
                        onPress={() => onCompleteHabit(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                        <Ionicons name="checkmark" color="#047857" size={16} />
                      </Pressable>
                    )}
                    {onEditHabit && (
                      <Pressable
                        onPress={() => onEditHabit(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-brand-100">
                        <Ionicons name="create" color="#1d4ed8" size={16} />
                      </Pressable>
                    )}
                    {onDeleteHabit && (
                      <Pressable
                        onPress={() => onDeleteHabit(item.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <Ionicons name="trash" color="#dc2626" size={16} />
                      </Pressable>
                    )}
                  </>
                )}
                <View className={`rounded-full px-3 py-1 ${getAccentForType(item.type)}`}>
                  <Text className="text-xs font-semibold">{item.dueLabel}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}
