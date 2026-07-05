import { render, screen } from '@testing-library/react-native';

import { useAppStore } from '@/core/store/appStore';
import { ProfileScreen } from '@/modules/profile/presentation/screens/ProfileScreen';

it('renders profile screen', () => {
  useAppStore.setState((state) => ({
    ...state,
    session: {
      user: { id: '1', name: 'Demo', email: 'demo@nexuslife.app' },
      token: 'token',
      isAuthenticated: true,
    },
  }));

  render(<ProfileScreen />);
  expect(screen.getByText('Profile')).toBeOnTheScreen();
});
