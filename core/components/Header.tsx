import { Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export function Header({ title, subtitle, eyebrow }: Props) {
  return (
    <View className="mb-6 gap-2">
      {eyebrow ? (
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-brand-700">{eyebrow}</Text>
      ) : null}
      <Text className="text-4xl font-bold tracking-tight text-ink">{title}</Text>
      {subtitle ? <Text className="max-w-[92%] text-base leading-7 text-muted">{subtitle}</Text> : null}
    </View>
  );
}
