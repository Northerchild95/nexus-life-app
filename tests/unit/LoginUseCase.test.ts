import { LoginUseCase } from '@/modules/auth/domain/useCases/LoginUseCase';

describe('LoginUseCase', () => {
  it('returns a session for valid credentials', async () => {
    const repository = {
      register: jest.fn(),
      login: jest.fn().mockResolvedValue({
        token: 'token',
        user: { id: '1', name: 'Demo', email: 'demo@nexuslife.app' },
      }),
    };

    const useCase = new LoginUseCase(repository);

    await expect(
      useCase.execute({ email: 'demo@nexuslife.app', password: 'Password123' }),
    ).resolves.toEqual({
      token: 'token',
      user: { id: '1', name: 'Demo', email: 'demo@nexuslife.app' },
    });
  });

  it('throws when email is invalid', async () => {
    const useCase = new LoginUseCase({ login: jest.fn(), register: jest.fn() });

    await expect(useCase.execute({ email: 'invalid', password: 'Password123' })).rejects.toThrow(
      'Email format is invalid',
    );
  });
});
