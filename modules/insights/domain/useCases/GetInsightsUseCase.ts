import type { InsightsRepository } from '../repositories';

export class GetInsightsUseCase {
  constructor(private insightsRepository: InsightsRepository) {}

  async execute(date: string) {
    return this.insightsRepository.getInsights(date);
  }
}
