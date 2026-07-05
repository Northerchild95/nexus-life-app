import { LocalAuthDataSource } from '@/modules/auth/data/datasources/LocalAuthDataSource';
import { AuthRepositoryImpl } from '@/modules/auth/data/repositories/AuthRepositoryImpl';

export function createAuthRepository() {
  return new AuthRepositoryImpl(new LocalAuthDataSource());
}
