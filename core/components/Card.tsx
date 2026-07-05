import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { cn } from '@/core/utils/cn';

type Props = PropsWithChildren<{
  className?: string;
  variant?: 'filled' | 'elevated' | 'outlined' | 'tinted';
}>;

const variants = {
  filled: 'bg-white shadow-card',
  elevated: 'bg-white shadow-lift',
  outlined: 'border border-border bg-surfaceSoft',
  tinted: 'bg-brand-50 border border-brand-100',
} as const;

export function Card({ children, className, variant = 'filled' }: Props) {
  return (
    <View className={cn('rounded-4xl p-5', variants[variant], className)}>
      {children}
    </View>
  );
}
