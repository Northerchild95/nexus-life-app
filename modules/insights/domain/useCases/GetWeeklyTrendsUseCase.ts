import type { InsightsRepository } from '../repositories';

export class GetWeeklyTrendsUseCase {
  constructor(private insightsRepository: InsightsRepository) {}

  async execute(weeks: number) {
    return this.insightsRepository.getWeeklyTrends(weeks);
  }
}
