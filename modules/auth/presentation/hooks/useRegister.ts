import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/core/store/appStore';
import { createAuthRepository } from '@/modules/auth/data/repositories/createAuthRepository';
import { RegisterUseCase } from '@/modules/auth/domain/useCases/RegisterUseCase';

export function useRegister() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const setSession = useAppStore((state) => state.setSession);
  const setAuthLoading = useAppStore((state) => state.setAuthLoading);
  const authLoading = useAppStore((state) => state.loading.auth);

  const registerUseCase = useMemo(() => {
    return new RegisterUseCase(createAuthRepository());
  }, []);

  const submit = async () => {
    setError(null);
    setSuccessMessage(null);
    const nextFieldErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      nextFieldErrors.name = t('auth.enterName');
    } else if (name.trim().length < 2) {
      nextFieldErrors.name = t('auth.useAtLeast2');
    }

    if (!email.trim()) {
      nextFieldErrors.email = t('auth.enterEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextFieldErrors.email = t('auth.useValidEmail');
    }

    if (!password.trim()) {
      nextFieldErrors.password = t('auth.createPassword');
    } else if (password.trim().length < 8) {
      nextFieldErrors.password = t('auth.useAtLeast8');
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      nextFieldErrors.password = t('auth.addUpperAndNumber');
    }

    if (!confirmPassword.trim()) {
      nextFieldErrors.confirmPassword = t('auth.repeatPassword');
    } else if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = t('auth.errors.passwordMismatch');
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setAuthLoading(true);

    try {
      const session = await registerUseCase.execute({
        name,
        email,
        password,
        confirmPassword,
      });

      setSession(session);
      setSuccessMessage(t('auth.accountCreated', { name: session.user.name }));
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : t('auth.unableToCreate');
      setError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    authLoading,
    confirmPassword,
    email,
    error,
    fieldErrors,
    name,
    password,
    setConfirmPassword,
    setEmail,
    setName,
    setPassword,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    submit,
    successMessage,
  };
}
