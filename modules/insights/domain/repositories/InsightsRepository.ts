import type { Insight } from '../entities';

export interface InsightsRepository {
  getInsights(date: string): Promise<Insight>;
  getWeeklyTrends(weeks: number): Promise<Insight['weeklyTrends']>;
}
