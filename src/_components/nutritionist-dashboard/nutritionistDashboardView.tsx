import type { NutritionistDashboardSummary } from '@/_types/nutritionistDashboard';
import Link from 'next/link';
import { AdherenceBucketsView } from './adherenceBucketsView';
import { NoDiaryEntryAlertsList } from './noDiaryEntryAlertsList';
import { PortfolioEvolutionChart } from './portfolioEvolutionChart';

interface NutritionistDashboardViewProps {
  summary: NutritionistDashboardSummary;
}

export function NutritionistDashboardView({
  summary,
}: NutritionistDashboardViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Painel de pacientes</h1>
        <Link
          href="/restrict/patients/lista"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver lista completa de pacientes
        </Link>
      </div>

      <AdherenceBucketsView buckets={summary.adherenceBuckets} />

      <section className="grid gap-4 xl:grid-cols-2">
        <NoDiaryEntryAlertsList entries={summary.noDiaryEntryAlerts} />
        <PortfolioEvolutionChart points={summary.portfolioWeightEvolution} />
      </section>
    </div>
  );
}
