export type FocusSessionStatus = 'active' | 'paused' | 'completed';

export interface FocusSession {
  id: string;
  focusId: string;
  focusTitle: string;
  startTime: number;
  endTime?: number;
  duration: number; // in milliseconds
  status: FocusSessionStatus;
  interruptionsCount: number;
  lastPauseTime?: number;
  totalPausedTime: number; // in milliseconds
}

export function createFocusSession(
  focusId: string,
  focusTitle: string,
  duration: number
): FocusSession {
  return {
    id: generateId(),
    focusId,
    focusTitle,
    startTime: Date.now(),
    duration,
    status: 'active',
    interruptionsCount: 0,
    totalPausedTime: 0,
  };
}

function generateId(): string {
  return `focus_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getElapsedTime(session: FocusSession): number {
  if (session.status === 'completed' && session.endTime) {
    return session.endTime - session.startTime - session.totalPausedTime;
  }

  const now = Date.now();
  const pausedTime = session.status === 'paused' && session.lastPauseTime
    ? (now - session.lastPauseTime)
    : 0;

  return now - session.startTime - session.totalPausedTime - pausedTime;
}

export function getRemainingTime(session: FocusSession): number {
  const elapsed = getElapsedTime(session);
  return Math.max(0, session.duration - elapsed);
}

export function isSessionExpired(session: FocusSession): boolean {
  return getRemainingTime(session) <= 0;
}
