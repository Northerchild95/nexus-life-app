import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useResolvedColorScheme } from '@/core/theme/useThemeSync';
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
  const isDark = useResolvedColorScheme() === 'dark';
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: isDark ? '#86b0ff' : '#1d4ed8',
          tabBarInactiveTintColor: isDark ? '#9ca3af' : '#64748b',
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
            backgroundColor: isDark ? '#242730' : '#ffffff',
            shadowColor: isDark ? '#000000' : '#10203a',
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
          },
          tabBarItemStyle: {
            borderRadius: 20,
          },
          sceneStyle: {
            backgroundColor: isDark ? '#1a1d21' : '#f3f6fb',
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={tabIcons[route.name]} color={color} size={size} />
          ),
        })}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarLabel: t('tabs.dashboard') }}
        />
        <Tab.Screen name="Habits" component={HabitsScreen} options={{ tabBarLabel: t('tabs.habits') }} />
        <Tab.Screen name="Tasks" component={TasksScreen} options={{ tabBarLabel: t('tabs.tasks') }} />
        <Tab.Screen name="Finance" component={FinanceScreen} options={{ tabBarLabel: t('tabs.finance') }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('tabs.profile') }} />
      </Tab.Navigator>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('assistant.open')}
        onPress={() => navigation.navigate('Assistant')}
        className="absolute right-5 h-14 w-14 items-center justify-center rounded-full bg-brand-600 shadow-lift"
        style={{ bottom: Math.max(insets.bottom, 10) + 86 }}>
        <Ionicons name="sparkles" size={24} color="#ffffff" />
      </Pressable>
    </View>
  );
}
