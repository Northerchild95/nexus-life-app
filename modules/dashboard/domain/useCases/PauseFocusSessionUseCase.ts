import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import type { FocusSessionRepository } from '@/modules/dashboard/domain/repositories/FocusSessionRepository';

export class PauseFocusSessionUseCase {
  constructor(private repository: FocusSessionRepository) {}

  async execute(sessionId: string): Promise<FocusSession> {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    if (session.status !== 'active') {
      throw new Error('La sesión no está activa');
    }

    const updatedSession: FocusSession = {
      ...session,
      status: 'paused',
      lastPauseTime: Date.now(),
      interruptionsCount: session.interruptionsCount + 1,
    };

    await this.repository.update(updatedSession);
    return updatedSession;
  }
}
