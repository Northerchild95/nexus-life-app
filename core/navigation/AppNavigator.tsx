import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthNavigator } from '@/core/navigation/AuthNavigator';
import { MainTabsNavigator } from '@/core/navigation/MainTabsNavigator';
import type { RootStackParamList } from '@/core/navigation/types';
import { useAppStore } from '@/core/store/appStore';
import { useResolvedColorScheme } from '@/core/theme/useThemeSync';
import { AssistantScreen } from '@/modules/assistant/presentation/screens/AssistantScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1d4ed8',
    background: '#f3f6fb',
    card: '#ffffff',
    text: '#10203a',
    border: '#d7dfeb',
    notification: '#dc2626',
  },
};

const darkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#86b0ff',
    background: '#1a1d21',
    card: '#242730',
    text: '#f5f5f5',
    border: '#374151',
    notification: '#f87171',
  },
};

export function AppNavigator() {
  const isAuthenticated = useAppStore((state) => state.session.isAuthenticated);
  const authLoading = useAppStore((state) => state.loading.auth);
  const isDark = useResolvedColorScheme() === 'dark';

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface dark:bg-dark-surface">
        <ActivityIndicator color={isDark ? '#86b0ff' : '#1d4ed8'} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={isDark ? darkNavigationTheme : lightNavigationTheme}>
      {isAuthenticated ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
          <RootStack.Screen
            name="Assistant"
            component={AssistantScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </RootStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
