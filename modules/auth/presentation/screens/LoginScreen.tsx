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
import { useLogin } from '@/modules/auth/presentation/hooks/useLogin';

export function LoginScreen() {
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
          eyebrow="Sign in"
          title="Welcome back"
          subtitle="Continue with the account that lives on this device and jump back into your planning flow."
        />
        <Card variant="elevated" className="gap-6 px-5 py-6">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-ink">Personal access</Text>
              <Text className="mt-2 text-sm leading-6 text-muted">
                Enter the same email and password you used when creating your local account.
              </Text>
            </View>
            <View className="rounded-2xl bg-brand-50 px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-brand-700">
                Secure
              </Text>
            </View>
          </View>
          <View className="gap-5">
            <Input
              label="Email"
              helperText="Use the email you registered with."
              error={fieldErrors.email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              testID="login-email-input"
              value={email}
            />
            <Input
              label="Password"
              helperText="Use the password linked to that account."
              error={fieldErrors.password}
              onChangeText={setPassword}
              onRightActionPress={() => setShowPassword((current) => !current)}
              placeholder="Enter your password"
              rightActionLabel={showPassword ? 'Hide' : 'Show'}
              secureTextEntry={!showPassword}
              testID="login-password-input"
              value={password}
            />
          </View>
          <View className="rounded-3xl bg-slate-50 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted">
              Session status
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-600">
              Your account remains stored locally on this device so you can continue without repeating setup.
            </Text>
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
            <Button label="Sign In" loading={authLoading} onPress={submit} />
            <Button
              label="Create a new account"
              onPress={() => navigation.navigate('Register')}
              variant="tonal"
            />
          </View>
          <View className="rounded-3xl border border-border bg-surfaceSoft p-4">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted">
              Demo access
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-600">
              Demo credentials: demo@nexuslife.app / Password123
            </Text>
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
}
