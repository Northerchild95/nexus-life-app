import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/core/utils/cn';

type Props = PropsWithChildren<{
  scrollable?: boolean;
  className?: string;
  contentClassName?: string;
}>;

export function ScreenContainer({
  children,
  scrollable = false,
  className,
  contentClassName,
}: Props) {
  const content = (
    <View className={cn('flex-1 bg-surface px-5 pt-6 pb-8', contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView className={cn('flex-1 bg-surface', className)}>
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
