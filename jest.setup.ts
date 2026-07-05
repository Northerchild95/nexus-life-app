import '@testing-library/jest-native/extend-expect';

jest.mock('@/core/utils/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
