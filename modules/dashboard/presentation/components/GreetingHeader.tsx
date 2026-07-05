import { Text, View } from 'react-native';

type Props = {
  userName?: string;
};

export function GreetingHeader({ userName }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
        Dashboard
      </Text>
      <Text className="text-4xl font-bold tracking-tight text-ink">
        {`Hola${userName ? `, ${userName}` : ''}`}
      </Text>
      <Text className="max-w-[92%] text-base leading-7 text-muted">
        Tu panorama de hoy combina enfoque, progreso y decisiones simples para mantener el ritmo.
      </Text>
    </View>
  );
}
