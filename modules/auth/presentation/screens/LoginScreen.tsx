import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { Input } from '@/core/components/Input';
import type { AuthStackParamList } from '@/core/navigation/types';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { AuthHero } from '@/modules/auth/presentation/components/AuthHero';
import { useLogin } from '@/modules/auth/presentation/hooks/useLogin';

export function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {
    authLoading,
    email,
    error,
    fieldErrors,
    password,
    setEmail,
    setPassword,
    setShowPassword,
    showPassword,
    submit,
    successMessage,
  } = useLogin();

  return (
    <ScreenContainer scrollable contentClassName="gap-6">
      <View className="gap-6">
        <AuthHero />
        <Header
          eyebrow={t('auth.signInEyebrow')}
          title={t('auth.loginTitle')}
          subtitle={t('auth.loginSubtitle')}
        />
        <Card variant="elevated" className="gap-6 px-5 py-6">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-ink dark:text-dark-ink">
                {t('auth.personalAccess')}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-muted dark:text-dark-muted">
                {t('auth.personalAccessDesc')}
              </Text>
            </View>
            <View className="rounded-2xl bg-brand-50 dark:bg-brand-900/30 px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-brand-700 dark:text-brand-200">
                {t('auth.secure')}
              </Text>
            </View>
          </View>
          <View className="gap-5">
            <Input
              label={t('auth.email')}
              helperText={t('auth.emailHelper')}
              error={fieldErrors.email}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              testID="login-email-input"
              value={email}
            />
            <Input
              label={t('auth.password')}
              helperText={t('auth.passwordHelper')}
              error={fieldErrors.password}
              onChangeText={setPassword}
              onRightActionPress={() => setShowPassword((current) => !current)}
              placeholder={t('auth.passwordPlaceholder')}
              rightActionLabel={showPassword ? t('common.hide') : t('common.show')}
              secureTextEntry={!showPassword}
              testID="login-password-input"
              value={password}
            />
          </View>
          <View className="rounded-3xl bg-slate-50 dark:bg-dark-surface-soft p-4">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted dark:text-dark-muted">
              {t('auth.sessionStatus')}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t('auth.sessionStatusDesc')}
            </Text>
          </View>
          {error ? (
            <View className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3">
              <Text className="text-sm font-medium text-danger dark:text-red-300">{error}</Text>
            </View>
          ) : null}
          {successMessage ? (
            <View className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-3">
              <Text className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{successMessage}</Text>
            </View>
          ) : null}
          <View className="gap-3">
            <Button label={t('auth.signInButton')} loading={authLoading} onPress={submit} />
            <Button
              label={t('auth.createAccountButton')}
              onPress={() => navigation.navigate('Register')}
              variant="tonal"
            />
          </View>
          <View className="rounded-3xl border border-border dark:border-dark-border bg-surface-soft dark:bg-dark-surface-soft p-4">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted dark:text-dark-muted">
              {t('auth.demoAccess')}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t('auth.demoCredentials')}
            </Text>
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
}
