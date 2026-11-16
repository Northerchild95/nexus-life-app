import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export function AuthHero() {
  const { t } = useTranslation();

  return (
    <View className="overflow-hidden rounded-[32px] bg-brand-700 px-6 pb-6 pt-5 shadow-lift">
      <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <View className="absolute right-10 top-20 h-14 w-14 rounded-full bg-brand-300/30" />
      <View className="absolute -left-6 bottom-10 h-24 w-24 rounded-full bg-white/5" />

      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold uppercase tracking-[2px] text-blue-100">
          {t('auth.hero.brand')}
        </Text>
        <View className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-white">
            {t('auth.hero.badge')}
          </Text>
        </View>
      </View>

      <Text className="mt-5 max-w-[85%] text-4xl font-bold leading-[44px] text-white">
        {t('auth.hero.title')}
      </Text>
      <Text className="mt-3 max-w-[92%] text-base leading-7 text-blue-100">
        {t('auth.hero.subtitle')}
      </Text>

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 rounded-3xl bg-white/10 px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-blue-100">
            {t('auth.hero.focusLabel')}
          </Text>
          <Text className="mt-2 text-xl font-bold text-white">{t('auth.hero.focusValue')}</Text>
        </View>
        <View className="flex-1 rounded-3xl bg-white/10 px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-blue-100">
            {t('auth.hero.rhythmLabel')}
          </Text>
          <Text className="mt-2 text-xl font-bold text-white">{t('auth.hero.rhythmValue')}</Text>
        </View>
      </View>
    </View>
  );
}
