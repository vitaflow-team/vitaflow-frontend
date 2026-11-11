import type { BmiClassification } from '@/_lib/bmi';

/** Who took the measurement: the user themselves, or an educator they are linked to. */
export type MeasurementSource = 'SELF' | 'EDUCATOR';

export interface MeasurementRecordResponseDTO {
  id: string;
  weightKg: number;
  heightCm: number;
  waistCm: number | null;
  hipCm: number | null;
  recordedAt: string;
  bmi: number;
  bmiClassification: BmiClassification;
  source: MeasurementSource;
  /** An educator's point cannot be edited or deleted by the student. */
  readOnly: boolean;
  educatorName: string | null;
}

export interface SmoothedWeightPoint {
  recordedAt: string;
  weightKg: number;
  smoothedWeightKg: number | null;
}

export interface PeriodComparisonMetricDTO {
  metric: 'weight' | 'diaryLoggedDays';
  current: number | null;
  previous: number | null;
  deltaPercent: number | null;
  noActivityThisPeriod?: boolean;
}

export interface StreakSummaryDTO {
  currentDays: number;
  personalBestDays: number;
}

export interface AdherenceSummaryDTO {
  workoutPercent: null;
  workoutTrackingUnavailable: true;
  hasWorkoutPlan: boolean;
  diaryPercent: number;
}

export interface CorrelationPointDTO {
  date: string;
  weight: number | null;
  diaryAdherencePercent: number | null;
}

export interface DashboardResponseDTO {
  latest: MeasurementRecordResponseDTO | null;
  weightVariationKg: number | null;
  /** `educatorName` is present only on points an educator measured. */
  weightSeries: Array<{
    recordedAt: string;
    weightKg: number;
    educatorName?: string;
  }>;
  bmiSeries: Array<{ recordedAt: string; bmi: number; educatorName?: string }>;
  history: MeasurementRecordResponseDTO[];
  /** Janela exata usada pelo backend — é ela, e não `Date.now()`, que define o eixo de tempo. */
  period: { weeks: 4 | 8 | 12; start: string; end: string };
  smoothedTrend: SmoothedWeightPoint[];
  periodComparison: PeriodComparisonMetricDTO[];
  streak: StreakSummaryDTO;
  adherence: AdherenceSummaryDTO;
  correlation: CorrelationPointDTO[];
}

export interface TrendPoint {
  recordedAt: string;
  value: number;
  educatorName?: string;
}

export interface LatestRecordResponseDTO {
  latest: MeasurementRecordResponseDTO | null;
}
