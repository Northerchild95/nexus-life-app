import 'react-native-gesture-handler';
import './global.css';

import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from '@/core/navigation/AppNavigator';
import { useResolvedColorScheme, useThemeSync } from '@/core/theme/useThemeSync';

export default function App() {
  useThemeSync();
  const scheme = useResolvedColorScheme();

  return (
    <GestureHandlerRootView className="flex-1 bg-surface dark:bg-dark-surface">
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
