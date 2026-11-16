import i18n from '@/core/i18n/i18n';
import type { AuthRepository, LoginParams } from '@/modules/auth/domain/repositories/AuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: LoginParams) {
    if (!params.email.trim()) {
      throw new Error(i18n.t('auth.errors.emailRequired'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      throw new Error(i18n.t('auth.errors.emailInvalid'));
    }

    if (!params.password.trim()) {
      throw new Error(i18n.t('auth.errors.passwordRequired'));
    }

    return this.authRepository.login({
      email: params.email.trim().toLowerCase(),
      password: params.password,
    });
  }
}
