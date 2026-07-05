import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { cn } from '@/core/utils/cn';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'tonal' | 'text' | 'destructive';
};

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: Props) {
  const isPrimary = variant === 'primary';
  const isText = variant === 'text';
  const isTonal = variant === 'tonal';
  const isDestructive = variant === 'destructive';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}>
      {({ pressed }) => (
        <View
          className={cn(
            'min-h-12 items-center justify-center rounded-2xl px-4',
            isPrimary && 'bg-brand-600 shadow-lift',
            variant === 'secondary' && 'border border-border bg-white',
            isTonal && 'bg-brand-100',
            isText && 'bg-transparent',
            isDestructive && 'bg-red-600 shadow-lift',
            pressed && !disabled && 'opacity-90',
            disabled && 'opacity-60',
          )}>
          {loading ? (
            <ActivityIndicator
              color={isPrimary ? '#ffffff' : isText ? '#1d4ed8' : '#10203a'}
            />
          ) : (
            <Text
              className={cn(
                'text-base font-semibold',
                isPrimary && 'text-white',
                variant === 'secondary' && 'text-ink',
                isTonal && 'text-brand-700',
                isText && 'text-brand-700',
                isDestructive && 'text-white',
              )}>
              {label}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
