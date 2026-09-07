import * as Haptics from 'expo-haptics';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable } from 'react-native';

export function HapticTab(props: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
