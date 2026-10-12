import type { Insight } from '../../domain/entities';
import type { InsightsRepository } from '../../domain/repositories';
import { LocalInsightsDataSource } from '../datasources';

export class InsightsRepositoryImpl implements InsightsRepository {
  private dataSource = new LocalInsightsDataSource();

  async getInsights(date: string): Promise<Insight> {
    return this.dataSource.getInsights(date);
  }

  async getWeeklyTrends(weeks: number): Promise<Insight['weeklyTrends']> {
    return this.dataSource.getWeeklyTrends(weeks);
  }
}
