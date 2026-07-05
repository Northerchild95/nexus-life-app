import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '@/core/navigation/types';
import { useAppStore } from '@/core/store/appStore';
import { LoginScreen } from '@/modules/auth/presentation/screens/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

describe('LoginScreen', () => {
  beforeEach(() => {
    useAppStore.setState({
      session: { user: null, token: null, isAuthenticated: false },
      loading: { auth: false },
      ui: { theme: 'light' },
    });
  });

  it('renders and logs in with demo credentials', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen component={LoginScreen} name="Login" />
        </Stack.Navigator>
      </NavigationContainer>,
    );

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(useAppStore.getState().session.isAuthenticated).toBe(true);
    });
  });
});
