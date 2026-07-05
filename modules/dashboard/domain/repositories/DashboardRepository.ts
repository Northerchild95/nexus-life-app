import type { DashboardSummary } from '@/modules/dashboard/domain/entities';

export type GetDashboardSummaryParams = {
  userName?: string;
  date: string;
};

export interface DashboardRepository {
  getSummary(params: GetDashboardSummaryParams): Promise<DashboardSummary>;
}
