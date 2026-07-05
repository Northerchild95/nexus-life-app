import { DashboardRepositoryImpl } from './DashboardRepositoryImpl';

export function createDashboardRepository() {
  return new DashboardRepositoryImpl();
}
