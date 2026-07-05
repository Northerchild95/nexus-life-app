import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Card } from '@/core/components/Card';
import type { DashboardMetric } from '@/modules/dashboard/domain/entities';

type Props = {
  metrics: DashboardMetric[];
};

const getIconForType = (type: DashboardMetric['type']): { icon: keyof typeof Ionicons.glyphMap; iconClassName: string; iconColor: string } => {
  switch (type) {
    case 'habits':
      return { icon: 'leaf', iconClassName: 'bg-emerald-100', iconColor: '#047857' };
    case 'tasks':
      return { icon: 'checkmark-circle', iconClassName: 'bg-brand-100', iconColor: '#1d4ed8' };
    case 'budget':
      return { icon: 'wallet', iconClassName: 'bg-amber-100', iconColor: '#b45309' };
  }
};

export function DailySummary({ metrics }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-xl font-semibold text-ink">Resumen del dia</Text>
      <View className="flex-row gap-3">
        {metrics.map((metric) => {
          const { icon, iconClassName, iconColor } = getIconForType(metric.type);
          return (
            <Card key={metric.type} variant="outlined" className="flex-1 gap-3 px-4 py-4">
              <View
                className={`h-10 w-10 items-center justify-center rounded-2xl ${iconClassName}`}>
                <Ionicons name={icon} color={iconColor} size={20} />
              </View>
              <View>
                <Text className="text-sm font-medium text-muted">{metric.label}</Text>
                <Text className="mt-1 text-2xl font-bold text-ink">{metric.value}</Text>
                <Text className="mt-1 text-sm leading-5 text-slate-600">{metric.caption}</Text>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
}
