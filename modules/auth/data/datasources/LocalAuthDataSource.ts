import AsyncStorage from '@/core/utils/async-storage';

import type {
  AuthSession,
  LoginParams,
  RegisterParams,
} from '@/modules/auth/domain/repositories/AuthRepository';

type StoredAuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

const STORAGE_KEY = 'nexus-life:auth-users';

const seedUsers: StoredAuthUser[] = [
  {
    id: 'user-demo',
    name: 'Nexus User',
    email: 'demo@nexuslife.app',
    password: 'Password123',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class LocalAuthDataSource {
  async login({ email, password }: LoginParams): Promise<AuthSession> {
    await wait(250);

    const users = await this.readUsers();
    const user = users.find((entry) => entry.email === email);

    if (!user) {
      throw new Error('No account found with this email');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password');
    }

    return this.createSession(user);
  }

  async register({ name, email, password }: RegisterParams): Promise<AuthSession> {
    await wait(250);

    const users = await this.readUsers();
    const existingUser = users.find((entry) => entry.email === email);

    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const newUser: StoredAuthUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newUser, ...users]));

    return this.createSession(newUser);
  }

  private async readUsers() {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
      return seedUsers;
    }

    try {
      const parsed = JSON.parse(storedValue) as StoredAuthUser[];
      return Array.isArray(parsed) ? parsed : seedUsers;
    } catch {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
      return seedUsers;
    }
  }

  private createSession(user: StoredAuthUser): AuthSession {
    return {
      token: `local-session-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
