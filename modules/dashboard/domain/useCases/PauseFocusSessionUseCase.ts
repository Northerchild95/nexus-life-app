import i18n from '@/core/i18n/i18n';
import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import type { FocusSessionRepository } from '@/modules/dashboard/domain/repositories/FocusSessionRepository';

export class PauseFocusSessionUseCase {
  constructor(private repository: FocusSessionRepository) {}

  async execute(sessionId: string): Promise<FocusSession> {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error(i18n.t('dashboard.focus.errors.sessionNotFound'));
    }

    if (session.status !== 'active') {
      throw new Error(i18n.t('dashboard.focus.errors.sessionNotActive'));
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
