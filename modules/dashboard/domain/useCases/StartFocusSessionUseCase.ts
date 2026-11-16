import i18n from '@/core/i18n/i18n';
import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import type { FocusSessionRepository } from '@/modules/dashboard/domain/repositories/FocusSessionRepository';

export class StartFocusSessionUseCase {
  constructor(private repository: FocusSessionRepository) {}

  async execute(focusId: string, focusTitle: string, duration: number): Promise<FocusSession> {
    // Check if there's an active session
    const activeSession = await this.repository.getActiveSession();
    if (activeSession) {
      throw new Error(i18n.t('dashboard.focus.errors.alreadyRunning'));
    }

    const session = {
      id: this.generateId(),
      focusId,
      focusTitle,
      startTime: Date.now(),
      duration,
      status: 'active' as const,
      interruptionsCount: 0,
      totalPausedTime: 0,
    };

    await this.repository.save(session);
    return session;
  }

  private generateId(): string {
    return `focus_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
