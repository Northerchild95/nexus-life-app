import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import type { FocusSessionRepository } from '@/modules/dashboard/domain/repositories/FocusSessionRepository';

export class ResumeFocusSessionUseCase {
  constructor(private repository: FocusSessionRepository) {}

  async execute(sessionId: string): Promise<FocusSession> {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    if (session.status !== 'paused') {
      throw new Error('La sesión no está pausada');
    }

    if (!session.lastPauseTime) {
      throw new Error('No hay tiempo de pausa registrado');
    }

    const pausedDuration = Date.now() - session.lastPauseTime;
    const updatedSession: FocusSession = {
      ...session,
      status: 'active',
      lastPauseTime: undefined,
      totalPausedTime: session.totalPausedTime + pausedDuration,
    };

    await this.repository.update(updatedSession);
    return updatedSession;
  }
}
