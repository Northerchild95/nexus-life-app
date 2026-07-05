import { useMemo, useState } from 'react';

import { useAppStore } from '@/core/store/appStore';
import { createAuthRepository } from '@/modules/auth/data/repositories/createAuthRepository';
import { LoginUseCase } from '@/modules/auth/domain/useCases/LoginUseCase';

export function useLogin() {
  const [email, setEmail] = useState('demo@nexuslife.app');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const setSession = useAppStore((state) => state.setSession);
  const setAuthLoading = useAppStore((state) => state.setAuthLoading);
  const authLoading = useAppStore((state) => state.loading.auth);

  const loginUseCase = useMemo(() => {
    return new LoginUseCase(createAuthRepository());
  }, []);

  const submit = async () => {
    setError(null);
    setSuccessMessage(null);
    const nextFieldErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nextFieldErrors.email = 'Enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextFieldErrors.email = 'Use a valid email address';
    }

    if (!password.trim()) {
      nextFieldErrors.password = 'Enter your password';
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setAuthLoading(true);

    try {
      const session = await loginUseCase.execute({ email, password });
      setSession(session);
      setSuccessMessage(`Welcome back, ${session.user.name}`);
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Unable to login';
      setError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    authLoading,
    email,
    error,
    fieldErrors,
    password,
    setEmail,
    setPassword,
    setShowPassword,
    showPassword,
    successMessage,
    submit,
  };
}
