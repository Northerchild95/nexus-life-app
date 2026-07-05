import { render, screen } from '@testing-library/react-native';

import { TasksScreen } from '@/modules/tasks/presentation/screens/TasksScreen';

it('renders tasks screen', () => {
  render(<TasksScreen />);
  expect(screen.getByText('Tasks')).toBeOnTheScreen();
});
