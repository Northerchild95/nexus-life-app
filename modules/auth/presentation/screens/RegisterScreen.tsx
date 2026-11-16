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
import { useRegister } from '@/modules/auth/presentation/hooks/useRegister';

export function RegisterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {
    authLoading,
    confirmPassword,
    email,
    error,
    fieldErrors,
    name,
    password,
    setConfirmPassword,
    setEmail,
    setName,
    setPassword,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    submit,
    successMessage,
  } = useRegister();

  const passwordChecks = [
    { key: 'length', label: t('auth.ruleLength'), met: password.trim().length >= 8 },
    { key: 'uppercase', label: t('auth.ruleUppercase'), met: /[A-Z]/.test(password) },
    { key: 'number', label: t('auth.ruleNumber'), met: /[0-9]/.test(password) },
    {
      key: 'match',
      label: t('auth.ruleMatch'),
      met: confirmPassword.length > 0 && password === confirmPassword,
    },
  ];

  return (
    <ScreenContainer scrollable contentClassName="gap-6">
      <AuthHero />
      <Header
        eyebrow={t('auth.registerEyebrow')}
        title={t('auth.registerTitle')}
        subtitle={t('auth.registerSubtitle')}
      />
      <Card variant="elevated" className="gap-6 px-5 py-6">
        <View className="gap-4 rounded-[28px] bg-slate-50 dark:bg-dark-surface-soft p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-ink dark:text-dark-ink">
              {t('auth.accountSetup')}
            </Text>
            <View className="rounded-2xl bg-white dark:bg-dark-surface px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-brand-700 dark:text-white">
                {t('auth.localProfile')}
              </Text>
            </View>
          </View>
          <View className="gap-3">
            {passwordChecks.map((rule) => (
              <View key={rule.key} className="flex-row items-center gap-3">
                <View
                  className={`h-2.5 w-2.5 rounded-full ${rule.met ? 'bg-emerald-600' : 'bg-brand-200'}`}
                />
                <Text className={rule.met ? 'text-sm text-emerald-700 dark:text-emerald-400' : 'text-sm text-muted dark:text-dark-muted'}>
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-5">
          <Input
            label={t('auth.fullName')}
            error={fieldErrors.name}
            helperText={t('auth.fullNameHelper')}
            onChangeText={setName}
            placeholder={t('auth.fullNamePlaceholder')}
            value={name}
          />
          <Input
            label={t('auth.email')}
            error={fieldErrors.email}
            helperText={t('auth.emailHelperRegister')}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
          />
          <Input
            label={t('auth.password')}
            error={fieldErrors.password}
            helperText={t('auth.passwordHelperRegister')}
            onChangeText={setPassword}
            onRightActionPress={() => setShowPassword((current) => !current)}
            placeholder={t('auth.passwordPlaceholderRegister')}
            rightActionLabel={showPassword ? t('common.hide') : t('common.show')}
            secureTextEntry={!showPassword}
            value={password}
          />
          <Input
            label={t('auth.confirmPassword')}
            error={fieldErrors.confirmPassword}
            helperText={t('auth.confirmPasswordHelper')}
            onChangeText={setConfirmPassword}
            onRightActionPress={() => setShowConfirmPassword((current) => !current)}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            rightActionLabel={showConfirmPassword ? t('common.hide') : t('common.show')}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
          />
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
          <Button label={t('auth.createAccountSubmit')} loading={authLoading} onPress={submit} />
          <Button
            label={t('auth.alreadyHaveAccountButton')}
            onPress={() => navigation.navigate('Login')}
            variant="tonal"
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}
