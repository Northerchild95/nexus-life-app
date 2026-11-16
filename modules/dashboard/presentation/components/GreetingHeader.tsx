import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

type Props = {
  userName?: string;
};

export function GreetingHeader({ userName }: Props) {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboard.greeting.morning')
      : hour < 19
        ? t('dashboard.greeting.afternoon')
        : t('dashboard.greeting.evening');

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700 dark:text-white">
        {t('dashboard.eyebrow')}
      </Text>
      <Text className="text-4xl font-bold tracking-tight text-ink dark:text-dark-ink">
        {userName ? t('dashboard.greeting.withName', { greeting, name: userName }) : greeting}
      </Text>
      <Text className="max-w-[92%] text-base leading-7 text-muted dark:text-dark-muted">
        {t('dashboard.subtitle')}
      </Text>
    </View>
  );
}
