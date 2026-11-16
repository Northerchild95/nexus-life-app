import { AssistantHistoryRepositoryImpl } from './AssistantHistoryRepositoryImpl';

export function createAssistantHistoryRepository() {
  return new AssistantHistoryRepositoryImpl();
}
