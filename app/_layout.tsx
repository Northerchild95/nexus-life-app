import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import '../global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from '@/core/navigation/AppNavigator';
import { useResolvedColorScheme, useThemeSync } from '@/core/theme/useThemeSync';
import { configureI18n } from '@/core/i18n/i18n';
import { useAppStore } from '@/core/store/appStore';

export default function RootLayout() {
  // Keeps NativeWind's color scheme in sync with the persisted store theme.
  useThemeSync();
  const scheme = useResolvedColorScheme();
  const language = useAppStore((state) => state.ui.language);

  // Keep i18n in sync with the persisted language (restored on start).
  useEffect(() => {
    void configureI18n(language);
  }, [language]);

  return (
    <GestureHandlerRootView className="flex-1 bg-surface dark:bg-dark-surface">
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
