import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1d21' : '#fff',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#d7dfeb',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color as string || '#0A7EA5'} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: t('tabs.habits'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color as string || '#0A7EA5'} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: t('tabs.tasks'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color as string || '#0A7EA5'} />,
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: t('tabs.finance'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dollarsign.circle.fill" color={color as string || '#0A7EA5'} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t('tabs.insights'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color as string || '#0A7EA5'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color as string || '#0A7EA5'} />,
        }}
      />
    </Tabs>
  );
}
