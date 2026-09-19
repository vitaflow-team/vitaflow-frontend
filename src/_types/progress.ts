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
}

export interface TrendPoint {
  recordedAt: string;
  value: number;
}
