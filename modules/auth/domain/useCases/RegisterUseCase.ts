import type { AuthRepository, RegisterParams } from '@/modules/auth/domain/repositories/AuthRepository';

type RegisterInput = RegisterParams & {
  confirmPassword: string;
};

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: RegisterInput) {
    if (!params.name.trim()) {
      throw new Error('Name is required');
    }

    if (params.name.trim().length < 2) {
      throw new Error('Name must have at least 2 characters');
    }

    if (!params.email.trim()) {
      throw new Error('Email is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      throw new Error('Email format is invalid');
    }

    if (params.password.trim().length < 8) {
      throw new Error('Password must have at least 8 characters');
    }

    if (!/[A-Z]/.test(params.password)) {
      throw new Error('Password must include at least one uppercase letter');
    }

    if (!/[0-9]/.test(params.password)) {
      throw new Error('Password must include at least one number');
    }

    if (params.password !== params.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return this.authRepository.register({
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      password: params.password,
    });
  }
}
