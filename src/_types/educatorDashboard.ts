export interface EducatorDashboardCounters {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
}

export type StudentRiskSeverity = 'YELLOW' | 'RED';
export type StudentRiskReason = 'NO_CONTACT' | 'OVERDUE_PAYMENT';

export interface StudentRiskEntry {
  clientId: string;
  clientName: string;
  severity: StudentRiskSeverity;
  reasons: StudentRiskReason[];
  daysSinceLastContact: number | null;
  billingAvailable: boolean;
}

export interface RevenueSeriesPoint {
  clientId: string;
  clientName: string;
  year: number;
  month: number;
  amountCents: number;
}

export interface EducatorDashboardSummary {
  counters: EducatorDashboardCounters;
  riskRanking: StudentRiskEntry[];
  revenueByStudentMonth: RevenueSeriesPoint[];
  noContactAlerts: StudentRiskEntry[];
}
