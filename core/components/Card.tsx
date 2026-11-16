import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { cn } from '@/core/utils/cn';

type Props = PropsWithChildren<{
  className?: string;
  variant?: 'filled' | 'elevated' | 'outlined' | 'tinted' | 'ink';
}>;

const variants = {
  filled: 'bg-white dark:bg-dark-surface shadow-card dark:shadow-dark-card',
  elevated: 'bg-white dark:bg-dark-surface shadow-lift dark:shadow-dark-card',
  outlined: 'border border-border dark:border-dark-border bg-surface-soft dark:bg-dark-surface',
  tinted: 'bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800',
  // Always-dark card. Do not add a `bg-white` base here: Tailwind emits
  // `bg-white` after `bg-ink`, so a conflicting base background would win and
  // leave the light-colored text invisible in light mode.
  ink: 'bg-ink dark:bg-dark-surface shadow-lift dark:shadow-dark-card',
} as const;

export function Card({ children, className, variant = 'filled' }: Props) {
  return (
    <View className={cn('rounded-4xl p-5', variants[variant], className)}>
      {children}
    </View>
  );
}
