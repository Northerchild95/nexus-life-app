import { Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import { useAppStore } from '@/core/store/appStore';

export function ProfileScreen() {
  const clearSession = useAppStore((state) => state.clearSession);
  const user = useAppStore((state) => state.session.user);

  return (
    <ScreenContainer scrollable contentClassName="gap-4">
      <Header title="Profile" subtitle="Personal settings and account controls." />

      <Card className="gap-4">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-100">
            <Text className="text-2xl font-bold text-brand-700">
              {(user?.name ?? 'G').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-ink">{user?.name ?? 'Guest User'}</Text>
            <Text className="mt-1 text-sm text-muted">{user?.email ?? 'guest@nexuslife.app'}</Text>
          </View>
        </View>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink">Personal rhythm</Text>
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-4">
            <Text className="text-sm font-medium text-muted">Theme</Text>
            <Text className="mt-1 text-lg font-semibold text-ink">Light mode</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-4">
            <Text className="text-sm font-medium text-muted">Weekly score</Text>
            <Text className="mt-1 text-lg font-semibold text-ink">8.4 / 10</Text>
          </View>
        </View>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink">Preferences</Text>
        {[
          ['Notifications', 'Daily planning reminders at 7:00 AM'],
          ['Focus mode', 'Enabled during deep work blocks'],
          ['Security', 'Session protected with biometric unlock'],
        ].map(([label, value]) => (
          <View key={label} className="rounded-2xl border border-border px-4 py-4">
            <Text className="text-sm font-medium text-muted">{label}</Text>
            <Text className="mt-1 text-base font-semibold text-ink">{value}</Text>
          </View>
        ))}
      </Card>

      <Card className="gap-4 mb-10">
        <Text className="text-base text-slate-700">
          Logged in as {user?.name ?? 'Guest'} {user?.email ? `(${user.email})` : ''}
        </Text>
        <Button label="Sign Out" onPress={clearSession} variant="secondary" />
      </Card>
    </ScreenContainer>
  );
}
