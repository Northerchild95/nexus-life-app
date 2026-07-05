import type { User } from '@/modules/auth/domain/entities/User';

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  user: User;
  token: string;
};

export interface AuthRepository {
  login(params: LoginParams): Promise<AuthSession>;
  register(params: RegisterParams): Promise<AuthSession>;
}
