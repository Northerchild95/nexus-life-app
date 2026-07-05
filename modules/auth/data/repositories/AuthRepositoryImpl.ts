import type {
  AuthRepository,
  AuthSession,
  LoginParams,
  RegisterParams,
} from '@/modules/auth/domain/repositories/AuthRepository';
import { LocalAuthDataSource } from '@/modules/auth/data/datasources/LocalAuthDataSource';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: LocalAuthDataSource) {}

  login(params: LoginParams): Promise<AuthSession> {
    return this.dataSource.login(params);
  }

  register(params: RegisterParams): Promise<AuthSession> {
    return this.dataSource.register(params);
  }
}
