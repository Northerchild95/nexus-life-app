import type { FocusSession } from '../entities/FocusSession';

export interface FocusSessionRepository {
  save(session: FocusSession): Promise<void>;
  getActiveSession(): Promise<FocusSession | null>;
  getById(id: string): Promise<FocusSession | null>;
  update(session: FocusSession): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(): Promise<FocusSession[]>;
}
