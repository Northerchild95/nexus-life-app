import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainTabParamList } from '@/core/navigation/types';
import { DashboardScreen } from '@/modules/dashboard/presentation/screens/DashboardScreen';
import { FinanceScreen } from '@/modules/finance/presentation/screens/FinanceScreen';
import { HabitsScreen } from '@/modules/habits/presentation/screens/HabitsScreen';
import { ProfileScreen } from '@/modules/profile/presentation/screens/ProfileScreen';
import { TasksScreen } from '@/modules/tasks/presentation/screens/TasksScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'grid',
  Habits: 'leaf',
  Tasks: 'checkmark-circle',
  Finance: 'wallet',
  Profile: 'person',
};

export function MainTabsNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 10),
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          borderRadius: 28,
          backgroundColor: '#ffffff',
          shadowColor: '#10203a',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        },
        tabBarItemStyle: {
          borderRadius: 20,
        },
        sceneStyle: {
          backgroundColor: '#f3f6fb',
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} color={color} size={size} />
        ),
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
