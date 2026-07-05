import type { AuthRepository, LoginParams } from '@/modules/auth/domain/repositories/AuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: LoginParams) {
    if (!params.email.trim()) {
      throw new Error('Email is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      throw new Error('Email format is invalid');
    }

    if (!params.password.trim()) {
      throw new Error('Password is required');
    }

    return this.authRepository.login({
      email: params.email.trim().toLowerCase(),
      password: params.password,
    });
  }
}
