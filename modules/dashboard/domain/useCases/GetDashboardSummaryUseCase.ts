import type {
  DashboardRepository,
  GetDashboardSummaryParams,
} from '@/modules/dashboard/domain/repositories';

export class GetDashboardSummaryUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(params: GetDashboardSummaryParams) {
    if (!params.date.trim()) {
      throw new Error('Dashboard date is required');
    }

    return this.dashboardRepository.getSummary({
      ...params,
      userName: params.userName?.trim() || undefined,
      date: params.date.trim(),
    });
  }
}
