import { useEffect } from 'react';
import { colorScheme, useColorScheme } from 'nativewind';

import { useAppStore } from '@/core/store/appStore';

/**
 * Pushes the persisted theme (Zustand) into NativeWind.
 *
 * NativeWind resolves `dark:` variants from its internal color scheme, not
 * from a `dark` className. Keeping this in a single effect guarantees that:
 *  - the theme is applied on cold start (including AsyncStorage rehydration), and
 *  - every change from the store immediately re-renders dark/light styles.
 */
export function useThemeSync() {
  const theme = useAppStore((state) => state.ui.theme);

  useEffect(() => {
    colorScheme.set(theme);
  }, [theme]);
}

/** Resolved scheme ('light' | 'dark') including manual overrides. */
export function useResolvedColorScheme(): 'light' | 'dark' {
  const { colorScheme: scheme } = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

export function useIsDarkMode(): boolean {
  return useResolvedColorScheme() === 'dark';
}
