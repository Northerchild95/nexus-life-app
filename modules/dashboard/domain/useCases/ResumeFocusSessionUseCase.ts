import i18n from '@/core/i18n/i18n';
import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import type { FocusSessionRepository } from '@/modules/dashboard/domain/repositories/FocusSessionRepository';

export class ResumeFocusSessionUseCase {
  constructor(private repository: FocusSessionRepository) {}

  async execute(sessionId: string): Promise<FocusSession> {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error(i18n.t('dashboard.focus.errors.sessionNotFound'));
    }

    if (session.status !== 'paused') {
      throw new Error(i18n.t('dashboard.focus.errors.sessionNotPaused'));
    }

    if (!session.lastPauseTime) {
      throw new Error(i18n.t('dashboard.focus.errors.noPauseTime'));
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
