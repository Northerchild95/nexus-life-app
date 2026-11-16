import i18n from '@/core/i18n/i18n';
import type { AuthRepository, RegisterParams } from '@/modules/auth/domain/repositories/AuthRepository';

type RegisterInput = RegisterParams & {
  confirmPassword: string;
};

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: RegisterInput) {
    if (!params.name.trim()) {
      throw new Error(i18n.t('auth.errors.nameRequired'));
    }

    if (params.name.trim().length < 2) {
      throw new Error(i18n.t('auth.errors.nameMin'));
    }

    if (!params.email.trim()) {
      throw new Error(i18n.t('auth.errors.emailRequired'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      throw new Error(i18n.t('auth.errors.emailInvalid'));
    }

    if (params.password.trim().length < 8) {
      throw new Error(i18n.t('auth.errors.passwordMin'));
    }

    if (!/[A-Z]/.test(params.password)) {
      throw new Error(i18n.t('auth.errors.passwordUppercase'));
    }

    if (!/[0-9]/.test(params.password)) {
      throw new Error(i18n.t('auth.errors.passwordNumber'));
    }

    if (params.password !== params.confirmPassword) {
      throw new Error(i18n.t('auth.errors.passwordMismatch'));
    }

    return this.authRepository.register({
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      password: params.password,
    });
  }
}
