import type { AssistantMessage } from '../entities';

export interface AssistantHistoryRepository {
  getAll(): Promise<AssistantMessage[]>;
  saveAll(messages: AssistantMessage[]): Promise<void>;
  clear(): Promise<void>;
}
