import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import AsyncStorage from '@/core/utils/async-storage';
import { colorScheme } from 'nativewind';
import i18n, { type AppLanguage } from '@/core/i18n/i18n';
import type { User } from '@/modules/auth/domain/entities/User';

export type ThemeMode = 'light' | 'dark' | 'system';

type SessionState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

type LoadingState = {
  auth: boolean;
};

type UiState = {
  theme: ThemeMode;
  language: AppLanguage;
};

type AppState = {
  session: SessionState;
  loading: LoadingState;
  ui: UiState;
  setSession: (payload: { user: User; token: string }) => void;
  clearSession: () => void;
  setAuthLoading: (value: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: AppLanguage) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      session: {
        user: null,
        token: null,
        isAuthenticated: false,
      },
      loading: {
        auth: false,
      },
      ui: {
        theme: 'system',
        language: 'en',
      },
      setSession: ({ user, token }) =>
        set({
          session: {
            user,
            token,
            isAuthenticated: true,
          },
        }),
      clearSession: () =>
        set({
          session: {
            user: null,
            token: null,
            isAuthenticated: false,
          },
        }),
      setAuthLoading: (value) =>
        set((state) => ({
          loading: {
            ...state.loading,
            auth: value,
          },
        })),
      setTheme: (theme) => {
        colorScheme.set(theme);
        set((state) => ({
          ui: {
            ...state.ui,
            theme,
          },
        }));
      },
      setLanguage: (language) => {
        void i18n.changeLanguage(language);
        set((state) => ({
          ui: {
            ...state.ui,
            language,
          },
        }));
      },
    }),
    {
      name: 'nexus-life:app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        ui: state.ui,
      }),
      // The theme lives in AsyncStorage and is rehydrated asynchronously.
      // Apply it as soon as it is available so a cold start uses the saved
      // theme instead of the OS one until the user touches the toggle.
      onRehydrateStorage: () => (state) => {
        if (state?.ui.theme) {
          colorScheme.set(state.ui.theme);
        }
        if (state?.ui.language) {
          void i18n.changeLanguage(state.ui.language);
        }
      },
    },
  ),
);
