import type { AssistantMessage } from '../../domain/entities';
import type { AssistantHistoryRepository } from '../../domain/repositories';
import { LocalAssistantHistoryDataSource } from '../datasources';

export class AssistantHistoryRepositoryImpl implements AssistantHistoryRepository {
  private dataSource = new LocalAssistantHistoryDataSource();

  async getAll(): Promise<AssistantMessage[]> {
    return this.dataSource.getAll();
  }

  async saveAll(messages: AssistantMessage[]): Promise<void> {
    return this.dataSource.saveAll(messages);
  }

  async clear(): Promise<void> {
    return this.dataSource.clear();
  }
}
