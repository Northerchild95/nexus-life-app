import { Ionicons } from '@expo/vector-icons';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { MainTabParamList } from '@/core/navigation/types';

type Props = {
  onCreateTask?: () => void;
  onCreateHabit?: () => void;
  onCreateExpense?: () => void;
};

export function QuickActions({ onCreateTask, onCreateHabit, onCreateExpense }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  const actions = [
    {
      key: 'newTask',
      label: t('dashboard.quickAction.newTask'),
      caption: t('dashboard.quickAction.newTaskCaption'),
      icon: 'add-circle' as const,
      tone: 'bg-brand-100',
      color: '#1d4ed8',
      onPress: onCreateTask,
    },
    {
      key: 'newHabit',
      label: t('dashboard.quickAction.newHabit'),
      caption: t('dashboard.quickAction.newHabitCaption'),
      icon: 'leaf' as const,
      tone: 'bg-emerald-100',
      color: '#047857',
      onPress: onCreateHabit,
    },
    {
      key: 'logExpense',
      label: t('dashboard.quickAction.logExpense'),
      caption: t('dashboard.quickAction.logExpenseCaption'),
      icon: 'card' as const,
      tone: 'bg-amber-100',
      color: '#b45309',
      onPress: onCreateExpense,
    },
    {
      key: 'viewProfile',
      label: t('dashboard.quickAction.viewProfile'),
      caption: t('dashboard.quickAction.viewProfileCaption'),
      icon: 'person' as const,
      tone: 'bg-slate-100 dark:bg-dark-surface-strong',
      color: '#475569',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <View className="gap-3">
      <Text className="text-xl font-semibold text-ink dark:text-dark-ink">
        {t('dashboard.quickActions')}
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {actions.map((action) => (
          <Pressable key={action.key} onPress={action.onPress} className="min-w-[47%] flex-1">
            <Card variant="outlined" className="gap-3 px-4 py-4">
              <View className={`h-11 w-11 items-center justify-center rounded-2xl ${action.tone}`}>
                <Ionicons name={action.icon} color={action.color} size={21} />
              </View>
              <View>
                <Text className="text-base font-semibold text-ink dark:text-dark-ink">
                  {action.label}
                </Text>
                <Text className="mt-1 text-sm leading-5 text-muted dark:text-dark-muted">
                  {action.caption}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
