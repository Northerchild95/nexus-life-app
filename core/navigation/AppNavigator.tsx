import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

import { AuthNavigator } from '@/core/navigation/AuthNavigator';
import { MainTabsNavigator } from '@/core/navigation/MainTabsNavigator';
import { useAppStore } from '@/core/store/appStore';

export function AppNavigator() {
  const isAuthenticated = useAppStore((state) => state.session.isAuthenticated);
  const authLoading = useAppStore((state) => state.loading.auth);

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#1d4ed8" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
