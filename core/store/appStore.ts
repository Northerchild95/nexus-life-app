import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import AsyncStorage from '@/core/utils/async-storage';
import type { User } from '@/modules/auth/domain/entities/User';

type ThemeMode = 'light' | 'dark';

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
};

type AppState = {
  session: SessionState;
  loading: LoadingState;
  ui: UiState;
  setSession: (payload: { user: User; token: string }) => void;
  clearSession: () => void;
  setAuthLoading: (value: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
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
        theme: 'light',
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
      setTheme: (theme) =>
        set((state) => ({
          ui: {
            ...state.ui,
            theme,
          },
        })),
    }),
    {
      name: 'nexus-life:app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        ui: state.ui,
      }),
    },
  ),
);
