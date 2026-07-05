import { render, screen } from '@testing-library/react-native';

import { HabitsScreen } from '@/modules/habits/presentation/screens/HabitsScreen';

it('renders habits screen', () => {
  render(<HabitsScreen />);
  expect(screen.getByText('Habits')).toBeOnTheScreen();
});
