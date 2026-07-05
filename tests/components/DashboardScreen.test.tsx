import { render, screen } from '@testing-library/react-native';

import { DashboardScreen } from '@/modules/dashboard/presentation/screens/DashboardScreen';

it('renders dashboard screen', () => {
  render(<DashboardScreen />);
  expect(screen.getByText('Dashboard')).toBeOnTheScreen();
});
