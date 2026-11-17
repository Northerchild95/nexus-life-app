import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  AssistantActionStatus,
  AssistantIntent,
  AssistantMessage,
  AssistantMessageRole,
} from '../../domain/entities';

const ASSISTANT_HISTORY_STORAGE_KEY = '@nexus_assistant_history';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isMessageRole = (value: unknown): value is AssistantMessageRole =>
  value === 'user' || value === 'assistant';

const isActionStatus = (value: unknown): value is AssistantActionStatus =>
  value === 'pending' || value === 'confirmed' || value === 'cancelled';

const isIntent = (value: unknown): value is AssistantIntent => {
  if (!isRecord(value) || typeof value.title !== 'string') return false;

  if (value.kind === 'expense') {
    return (
      typeof value.amount === 'number' &&
      Number.isFinite(value.amount) &&
      typeof value.category === 'string' &&
      typeof value.date === 'string'
    );
  }

  if (value.kind === 'task') {
    return typeof value.priority === 'string' && typeof value.dueDate === 'string';
  }

  return false;
};

const isMessage = (value: unknown): value is AssistantMessage =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  isMessageRole(value.role) &&
  typeof value.text === 'string' &&
  typeof value.createdAt === 'string' &&
  (value.intent === undefined || isIntent(value.intent)) &&
  (value.pendingIntents === undefined ||
    (Array.isArray(value.pendingIntents) && value.pendingIntents.every(isIntent))) &&
  (value.actionStatus === undefined || isActionStatus(value.actionStatus));

export class LocalAssistantHistoryDataSource {
  async getAll(): Promise<AssistantMessage[]> {
    try {
      const data = await AsyncStorage.getItem(ASSISTANT_HISTORY_STORAGE_KEY);
      if (!data) return [];

      const parsed: unknown = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(isMessage);
    } catch (error) {
      console.error('Error reading assistant history:', error);
      return [];
    }
  }

  async saveAll(messages: AssistantMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ASSISTANT_HISTORY_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving assistant history:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ASSISTANT_HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing assistant history:', error);
      throw error;
    }
  }
}
