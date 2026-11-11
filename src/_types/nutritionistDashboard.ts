export interface PatientBucketEntry {
  clientId: string;
  clientName: string;
  daysSinceLastEntry: number | null;
  loggedDayRatio: number | null;
}

export interface PortfolioEvolutionPoint {
  monthsInCare: number;
  avgPercentChangeFromStart: number;
  contributingPatientCount: number;
}

export interface NutritionistDashboardSummary {
  adherenceBuckets: {
    compliant: PatientBucketEntry[];
    struggling: PatientBucketEntry[];
    nonAdherent: PatientBucketEntry[];
    noDataYet: PatientBucketEntry[];
  };
  noDiaryEntryAlerts: PatientBucketEntry[];
  portfolioWeightEvolution: PortfolioEvolutionPoint[];
}
