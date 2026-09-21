import type { BmiClassification } from '@/_lib/bmi';

export interface MeasurementRecordResponseDTO {
  id: string;
  weightKg: number;
  heightCm: number;
  waistCm: number | null;
  hipCm: number | null;
  recordedAt: string;
  bmi: number;
  bmiClassification: BmiClassification;
}

export interface DashboardResponseDTO {
  latest: MeasurementRecordResponseDTO | null;
  weightVariationKg: number | null;
  weightSeries: Array<{ recordedAt: string; weightKg: number }>;
  bmiSeries: Array<{ recordedAt: string; bmi: number }>;
  history: MeasurementRecordResponseDTO[];
  /** Janela exata usada pelo backend — é ela, e não `Date.now()`, que define o eixo de tempo. */
  period: { weeks: 4 | 8 | 12; start: string; end: string };
}

export interface TrendPoint {
  recordedAt: string;
  value: number;
}

export interface LatestRecordResponseDTO {
  latest: MeasurementRecordResponseDTO | null;
}
