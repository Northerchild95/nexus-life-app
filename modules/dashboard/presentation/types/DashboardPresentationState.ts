import type { DashboardSummary } from '@/modules/dashboard/domain/entities';

export type DashboardSummaryStatus = 'idle' | 'loading' | 'success' | 'error';

export type DashboardSummaryState = {
  status: DashboardSummaryStatus;
  summary: DashboardSummary | null;
  error: string | null;
};

export type DashboardSummaryViewModel = DashboardSummaryState & {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refresh: () => Promise<void>;
};
