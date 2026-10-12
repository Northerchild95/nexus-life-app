import { InsightsRepositoryImpl } from './InsightsRepositoryImpl';

export function createInsightsRepository() {
  return new InsightsRepositoryImpl();
}
