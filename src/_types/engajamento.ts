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

export interface EngajamentoSummary {
  todayCheckInCount: number;
  weeklyFrequencyAverage: number;
  atRisk: EngajamentoAtRiskStudent[];
  recentFeed: EngajamentoFeedEntry[];
}
