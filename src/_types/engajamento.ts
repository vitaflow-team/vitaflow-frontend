export interface EngajamentoAtRiskStudent {
  clientId: string;
  name: string;
  lastCheckInAt: string | null;
}

export interface EngajamentoFeedEntry {
  clientId: string;
  name: string;
  createdAt: string;
  source: 'SELF' | 'RECEPTIONIST';
  planValidAtCheckIn: boolean;
}

export interface EngajamentoHeatmapCell {
  weekday: number;
  hour: number;
  count: number;
}

export interface EngajamentoMonthOverMonth {
  currentMonthCount: number;
  previousMonthCount: number | null;
  isCurrentMonthPartial: boolean;
}

export interface EngajamentoSummary {
  todayCheckInCount: number;
  weeklyFrequencyAverage: number;
  atRisk: EngajamentoAtRiskStudent[];
  recentFeed: EngajamentoFeedEntry[];
  checkInHeatmap: EngajamentoHeatmapCell[];
  monthOverMonth: EngajamentoMonthOverMonth;
}
