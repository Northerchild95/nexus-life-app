import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import type { FocusSessionRepository } from '@/modules/dashboard/domain/repositories/FocusSessionRepository';

export class CompleteFocusSessionUseCase {
  constructor(private repository: FocusSessionRepository) {}

  async execute(sessionId: string): Promise<FocusSession> {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    const now = Date.now();
    let totalPausedTime = session.totalPausedTime;

    // If session is paused, add the current paused duration
    if (session.status === 'paused' && session.lastPauseTime) {
      totalPausedTime += now - session.lastPauseTime;
    }

    const updatedSession: FocusSession = {
      ...session,
      status: 'completed',
      endTime: now,
      lastPauseTime: undefined,
      totalPausedTime,
    };

    await this.repository.update(updatedSession);
    return updatedSession;
  }
}
