import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { useAppStore } from '@/core/store/appStore';
import { useIsDarkMode } from '@/core/theme/useThemeSync';

export function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const clearSession = useAppStore((state) => state.clearSession);
  const user = useAppStore((state) => state.session.user);
  const setTheme = useAppStore((state) => state.setTheme);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const isDark = useIsDarkMode();

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleLanguageToggle = () => {
    setLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  return (
    <ScreenContainer scrollable contentClassName="gap-4">
      <Header title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <Card className="gap-4">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <Text className="text-2xl font-bold text-brand-700 dark:text-brand-400">
              {(user?.name ?? 'G').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-ink dark:text-dark-ink">
              {user?.name ?? t('profile.guestUser')}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-dark-muted">
              {user?.email ?? t('profile.guestEmail')}
            </Text>
          </View>
        </View>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-dark-ink">{t('profile.personalRhythm')}</Text>
        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 rounded-2xl bg-slate-50 dark:bg-dark-surface-strong px-4 py-4"
            onPress={handleThemeToggle}>
            <Text className="text-sm font-medium text-muted dark:text-dark-muted">{t('profile.theme')}</Text>
            <Text className="mt-1 text-lg font-semibold text-ink dark:text-dark-ink">
              {isDark ? t('profile.darkMode') : t('profile.lightMode')}
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-2xl bg-slate-50 dark:bg-dark-surface-strong px-4 py-4"
            onPress={handleLanguageToggle}>
            <Text className="text-sm font-medium text-muted dark:text-dark-muted">{t('profile.language')}</Text>
            <Text className="mt-1 text-lg font-semibold text-ink dark:text-dark-ink">
              {i18n.language === 'es' ? t('profile.spanish') : t('profile.english')}
            </Text>
          </Pressable>
        </View>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-dark-ink">{t('profile.preferences')}</Text>
        {[
          [t('profile.notifications'), t('profile.notificationsDesc')],
          [t('profile.focusMode'), t('profile.focusModeDesc')],
          [t('profile.security'), t('profile.securityDesc')],
        ].map(([label, value]) => (
          <View key={label} className="rounded-2xl border border-border dark:border-dark-border px-4 py-4">
            <Text className="text-sm font-medium text-muted dark:text-dark-muted">{label}</Text>
            <Text className="mt-1 text-base font-semibold text-ink dark:text-dark-ink">{value}</Text>
          </View>
        ))}
      </Card>

      <Card className="gap-4 mb-10">
        <Text className="text-base text-slate-700 dark:text-slate-300">
          {t('profile.loggedInAs')} {user?.name ?? t('profile.guestUser')} {user?.email ? `(${user.email})` : ''}
        </Text>
        <Button label={t('profile.signOut')} onPress={clearSession} variant="secondary" />
      </Card>
    </ScreenContainer>
  );
}
