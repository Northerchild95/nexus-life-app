import { render, screen } from '@testing-library/react-native';

import { FinanceScreen } from '@/modules/finance/presentation/screens/FinanceScreen';

it('renders finance screen', () => {
  render(<FinanceScreen />);
  expect(screen.getByText('Finance')).toBeOnTheScreen();
});
