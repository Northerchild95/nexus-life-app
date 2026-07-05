import { useMemo, useState } from 'react';

import { useAppStore } from '@/core/store/appStore';
import { createAuthRepository } from '@/modules/auth/data/repositories/createAuthRepository';
import { RegisterUseCase } from '@/modules/auth/domain/useCases/RegisterUseCase';

export function useRegister() {
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
      nextFieldErrors.name = 'Enter your name';
    } else if (name.trim().length < 2) {
      nextFieldErrors.name = 'Use at least 2 characters';
    }

    if (!email.trim()) {
      nextFieldErrors.email = 'Enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextFieldErrors.email = 'Use a valid email address';
    }

    if (!password.trim()) {
      nextFieldErrors.password = 'Create a password';
    } else if (password.trim().length < 8) {
      nextFieldErrors.password = 'Use at least 8 characters';
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      nextFieldErrors.password = 'Add one uppercase letter and one number';
    }

    if (!confirmPassword.trim()) {
      nextFieldErrors.confirmPassword = 'Repeat your password';
    } else if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = 'Passwords do not match';
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
      setSuccessMessage(`Account created. Welcome, ${session.user.name}`);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Unable to create account';
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
