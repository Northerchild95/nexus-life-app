import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { Input } from '@/core/components/Input';
import type { AuthStackParamList } from '@/core/navigation/types';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { AuthHero } from '@/modules/auth/presentation/components/AuthHero';
import { useRegister } from '@/modules/auth/presentation/hooks/useRegister';

export function RegisterScreen() {
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
    { label: 'At least 8 characters', met: password.trim().length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
    { label: 'Passwords match', met: confirmPassword.length > 0 && password === confirmPassword },
  ];

  return (
    <ScreenContainer scrollable contentClassName="gap-6">
      <AuthHero />
      <Header
        eyebrow="Register"
        title="Create your Nexus"
        subtitle="Create a refined local account experience with clear security rules and a setup that feels trustworthy from the first tap."
      />
      <Card variant="elevated" className="gap-6 px-5 py-6">
        <View className="gap-4 rounded-[28px] bg-slate-50 p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-ink">Account setup</Text>
            <View className="rounded-2xl bg-white px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-brand-700">
                Local profile
              </Text>
            </View>
          </View>
          <View className="gap-3">
            {passwordChecks.map((rule) => (
              <View key={rule.label} className="flex-row items-center gap-3">
                <View
                  className={`h-2.5 w-2.5 rounded-full ${rule.met ? 'bg-emerald-600' : 'bg-brand-200'}`}
                />
                <Text className={rule.met ? 'text-sm text-emerald-700' : 'text-sm text-muted'}>
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-5">
          <Input
            label="Full name"
            error={fieldErrors.name}
            helperText="This is how your profile will appear across Nexus Life."
            onChangeText={setName}
            placeholder="Jane Doe"
            value={name}
          />
          <Input
            label="Email"
            error={fieldErrors.email}
            helperText="We'll use this as your unique account identifier."
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />
          <Input
            label="Password"
            error={fieldErrors.password}
            helperText="Create a strong password that meets all three rules above."
            onChangeText={setPassword}
            onRightActionPress={() => setShowPassword((current) => !current)}
            placeholder="Create a secure password"
            rightActionLabel={showPassword ? 'Hide' : 'Show'}
            secureTextEntry={!showPassword}
            value={password}
          />
          <Input
            label="Confirm password"
            error={fieldErrors.confirmPassword}
            helperText="Repeat the same password to confirm it."
            onChangeText={setConfirmPassword}
            onRightActionPress={() => setShowConfirmPassword((current) => !current)}
            placeholder="Repeat your password"
            rightActionLabel={showConfirmPassword ? 'Hide' : 'Show'}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
          />
        </View>
        {error ? (
          <View className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm font-medium text-danger">{error}</Text>
          </View>
        ) : null}
        {successMessage ? (
          <View className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <Text className="text-sm font-medium text-emerald-700">{successMessage}</Text>
          </View>
        ) : null}
        <View className="gap-3">
          <Button label="Create account" loading={authLoading} onPress={submit} />
          <Button
            label="I already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="tonal"
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}
