import type { DashboardSummary } from '@/modules/dashboard/domain/entities';
import type {
    DashboardRepository,
    GetDashboardSummaryParams,
} from '@/modules/dashboard/domain/repositories';
import { RealDashboardDataSource } from '../datasources/RealDashboardDataSource';

export class DashboardRepositoryImpl implements DashboardRepository {
  private dataSource: RealDashboardDataSource;

  constructor() {
    this.dataSource = new RealDashboardDataSource();
  }

  getSummary(params: GetDashboardSummaryParams): Promise<DashboardSummary> {
    return this.dataSource.getSummary(params);
  }
}
