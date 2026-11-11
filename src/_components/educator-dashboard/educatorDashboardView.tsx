import type { EducatorDashboardSummary } from '@/_types/educatorDashboard';
import Link from 'next/link';
import { CountersCard } from './countersCard';
import { NoContactAlertsList } from './noContactAlertsList';
import { RevenueChart } from './revenueChart';
import { RiskRankingList } from './riskRankingList';

interface EducatorDashboardViewProps {
  summary: EducatorDashboardSummary;
}

export function EducatorDashboardView({ summary }: EducatorDashboardViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Painel de alunos</h1>
        <Link
          href="/restrict/students/lista"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver lista completa de alunos
        </Link>
      </div>

      <CountersCard counters={summary.counters} />

      <section className="grid gap-4 xl:grid-cols-2">
        <RiskRankingList entries={summary.riskRanking} />
        <NoContactAlertsList entries={summary.noContactAlerts} />
      </section>

      <RevenueChart points={summary.revenueByStudentMonth} />
    </div>
  );
}
