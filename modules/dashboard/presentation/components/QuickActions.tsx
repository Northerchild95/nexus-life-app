import { Ionicons } from '@expo/vector-icons';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { MainTabParamList } from '@/core/navigation/types';

type Props = {
  onCreateTask?: () => void;
  onCreateHabit?: () => void;
  onCreateExpense?: () => void;
};

const actions = [
  {
    label: 'Nueva tarea',
    caption: 'Captura una prioridad',
    icon: 'add-circle' as const,
    tone: 'bg-brand-100',
    color: '#1d4ed8',
    goTo: ''
  },
  {
    label: 'Nuevo habito',
    caption: 'Suma una rutina',
    icon: 'leaf' as const,
    tone: 'bg-emerald-100',
    color: '#047857',
    goTo: ''
  },
  {
    label: 'Registrar gasto',
    caption: 'Actualiza tu presupuesto',
    icon: 'card' as const,
    tone: 'bg-amber-100',
    color: '#b45309',
    goTo: ''
  },
  {
    label: 'Ver perfil',
    caption: 'Ajusta tu cuenta',
    icon: 'person' as const,
    tone: 'bg-slate-100',
    color: '#475569',
    goTo: 'Profile',
  },
] as const;

export function QuickActions({ onCreateTask, onCreateHabit, onCreateExpense }: Props) {
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  return (
    <View className="gap-3">
      <Text className="text-xl font-semibold text-ink">Acciones rapidas</Text>
      <View className="flex-row flex-wrap gap-3">
        {actions.map((action) => (
          <Pressable
            key={action.label}
            onPress={
              action.label === 'Nueva tarea'
                ? onCreateTask
                : action.label === 'Nuevo habito'
                ? onCreateHabit
                : action.label === 'Registrar gasto'
                ? onCreateExpense
                : action.goTo
                  ? () => navigation.navigate(action.goTo as never)
                  : undefined
            }
            className="min-w-[47%] flex-1">
            <Card variant="outlined" className="gap-3 px-4 py-4">
              <View className={`h-11 w-11 items-center justify-center rounded-2xl ${action.tone}`}>
                <Ionicons name={action.icon} color={action.color} size={21} />
              </View>
              <View>
                <Text className="text-base font-semibold text-ink">{action.label}</Text>
                <Text className="mt-1 text-sm leading-5 text-muted">{action.caption}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
