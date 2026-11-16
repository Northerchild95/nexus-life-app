import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createAssistantHistoryRepository } from '../../data/repositories';
import type { AssistantActionStatus, AssistantMessage } from '../../domain/entities';

export function useAssistantHistory() {
  const { t } = useTranslation();
  const repository = useMemo(() => createAssistantHistoryRepository(), []);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<AssistantMessage[]>([]);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  const enqueue = useCallback(
    (operation: () => Promise<void>) => {
      saveQueue.current = saveQueue.current
        .catch(() => undefined)
        .then(operation)
        .catch((saveError) => {
          console.error('Error persisting assistant history:', saveError);
          setError(
            saveError instanceof Error
              ? saveError.message
              : t('assistant.errors.saveHistory'),
          );
        });
    },
    [t],
  );

  const commit = useCallback(
    (next: AssistantMessage[]) => {
      messagesRef.current = next;
      setMessages(next);
      setError(null);
      enqueue(() => repository.saveAll(next));
    },
    [enqueue, repository],
  );

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const stored = await repository.getAll();
        if (!isActive) return;

        messagesRef.current = stored;
        setMessages(stored);
        setError(null);
      } catch (loadError) {
        if (!isActive) return;
        setError(
          loadError instanceof Error ? loadError.message : t('assistant.errors.loadHistory'),
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [repository, t]);

  const appendMessage = useCallback(
    (message: AssistantMessage) => {
      commit([...messagesRef.current, message]);
    },
    [commit],
  );

  const updateActionStatus = useCallback(
    (messageId: string, status: AssistantActionStatus) => {
      commit(
        messagesRef.current.map((message) =>
          message.id === messageId ? { ...message, actionStatus: status } : message,
        ),
      );
    },
    [commit],
  );

  const clearHistory = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
    setError(null);
    enqueue(() => repository.clear());
  }, [enqueue, repository]);

  return {
    messages,
    isLoading,
    error,
    appendMessage,
    updateActionStatus,
    clearHistory,
  };
}
