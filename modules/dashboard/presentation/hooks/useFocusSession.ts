import { FocusSessionRepositoryImpl } from '@/modules/dashboard/data/repositories/FocusSessionRepositoryImpl';
import type { FocusSession } from '@/modules/dashboard/domain/entities/FocusSession';
import { getElapsedTime, getRemainingTime } from '@/modules/dashboard/domain/entities/FocusSession';
import { CompleteFocusSessionUseCase } from '@/modules/dashboard/domain/useCases/CompleteFocusSessionUseCase';
import { PauseFocusSessionUseCase } from '@/modules/dashboard/domain/useCases/PauseFocusSessionUseCase';
import { ResumeFocusSessionUseCase } from '@/modules/dashboard/domain/useCases/ResumeFocusSessionUseCase';
import { StartFocusSessionUseCase } from '@/modules/dashboard/domain/useCases/StartFocusSessionUseCase';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

const repository = new FocusSessionRepositoryImpl();
const startUseCase = new StartFocusSessionUseCase(repository);
const pauseUseCase = new PauseFocusSessionUseCase(repository);
const resumeUseCase = new ResumeFocusSessionUseCase(repository);
const completeUseCase = new CompleteFocusSessionUseCase(repository);

export function useFocusSession() {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  // Load active session on mount
  useEffect(() => {
    loadActiveSession();
  }, []);

  // Update timer every second when session is active
  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const interval = setInterval(() => {
      if (session) {
        setElapsedTime(getElapsedTime(session));
        setRemainingTime(getRemainingTime(session));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const loadActiveSession = async () => {
    try {
      setIsLoading(true);
      const activeSession = await repository.getActiveSession();
      setSession(activeSession);
      if (activeSession) {
        setElapsedTime(getElapsedTime(activeSession));
        setRemainingTime(getRemainingTime(activeSession));
      }
    } catch (err) {
      setError('Error loading session');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async (focusId: string, focusTitle: string, duration: number) => {
    try {
      setError(null);
      // Clear any existing completed sessions before starting new one
      const activeSession = await repository.getActiveSession();
      if (activeSession && activeSession.status === 'completed') {
        await repository.delete(activeSession.id);
      }
      const newSession = await startUseCase.execute(focusId, focusTitle, duration);
      setSession(newSession);
      setElapsedTime(0);
      setRemainingTime(duration);
      return newSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error starting session';
      setError(message);
      throw err;
    }
  };

  const pauseSession = async () => {
    if (!session) return;
    
    try {
      setError(null);
      const pausedSession = await pauseUseCase.execute(session.id);
      setSession(pausedSession);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error pausing session';
      setError(message);
      throw err;
    }
  };

  const resumeSession = async () => {
    if (!session) return;
    
    try {
      setError(null);
      const resumedSession = await resumeUseCase.execute(session.id);
      setSession(resumedSession);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error resuming session';
      setError(message);
      throw err;
    }
  };

  const playCompletionFeedback = async () => {
    // Heavy impact for strong vibration
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Wait a bit then another impact
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Success notification pattern
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setShowCompletionAlert(true);
  };

  const completeSession = async () => {
    if (!session) return;
    
    try {
      setError(null);
      const completedSession = await completeUseCase.execute(session.id);
      setSession(null);
      setElapsedTime(0);
      setRemainingTime(0);
      playCompletionFeedback();
      return completedSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error completing session';
      setError(message);
      throw err;
    }
  };

  const refresh = () => {
    loadActiveSession();
  };

  const closeCompletionAlert = () => {
    setShowCompletionAlert(false);
  };

  return {
    session,
    isLoading,
    error,
    elapsedTime,
    remainingTime,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    refresh,
    showCompletionAlert,
    closeCompletionAlert,
  };
}
