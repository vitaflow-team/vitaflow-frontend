import { PAGE_TITLES } from '@/_constants/pageTitles';
import { EmptyState } from '@/_components/progress/emptyState';
import { HistoryList } from '@/_components/progress/historyList';
import { FloatingRegisterButton } from '@/_components/progress/floatingRegisterButton';
import { PeriodSelector } from '@/_components/progress/periodSelector';
import { RecordFormModal } from '@/_components/progress/recordFormModal';
import { SummaryCards } from '@/_components/progress/summaryCards';
import { TrendChart } from '@/_components/progress/trendChart';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { apiClient } from '@/_lib/apiClient';
import { parsePeriod } from '@/_lib/progressPeriod';
import type { DashboardResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.progress,
};

interface ProgressPageProps {
  searchParams: Promise<{ semanas?: string | string[] }>;
}

export default async function ProgressPage({
  searchParams,
}: ProgressPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Qualquer valor estranho no endereço vira 8 aqui, então a API nunca recebe
  // um período inválido e o usuário nunca vê um erro por causa da URL (ADR-001).
  const { semanas } = await searchParams;
  const weeks = parsePeriod(semanas);

  let dashboard: DashboardResponseDTO;
  try {
    dashboard = await apiClient<DashboardResponseDTO>(
      `/progress-records/dashboard?weeks=${weeks}`,
      { method: 'GET' }
    );
  } catch (error) {
    console.error('Falha ao carregar evolução:', error);
    return (
      <DefaultLayout>
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          Não foi possível carregar sua evolução. Tente novamente mais tarde.
        </div>
      </DefaultLayout>
    );
  }

  const { period } = dashboard;

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4 pb-[calc(var(--bottom-nav-h,4.5rem)+env(safe-area-inset-bottom,0px)+5rem)] md:pb-0">
        <header className="flex flex-col gap-3 border-b border-primary pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Minha evolução</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas medidas e tendências ao longo do tempo.
            </p>
          </div>
          {dashboard.latest && (
            <RecordFormModal
              defaultHeightCm={dashboard.latest.heightCm}
              defaultWeightKg={dashboard.latest.weightKg}
            />
          )}
        </header>

        {dashboard.latest === null ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            <SummaryCards
              latest={dashboard.latest}
              weightVariationKg={dashboard.weightVariationKg}
              weightSeries={dashboard.weightSeries}
            />
            <PeriodSelector value={period.weeks} />
            <section
              aria-label="Tendências do período selecionado"
              className="grid min-w-0 gap-4 xl:grid-cols-2"
            >
              <TrendChart
                title="Evolução do peso"
                metric="weight"
                period={period}
                points={dashboard.weightSeries.map(point => ({
                  recordedAt: point.recordedAt,
                  value: point.weightKg,
                }))}
              />
              <TrendChart
                title="Evolução do IMC"
                metric="bmi"
                period={period}
                points={dashboard.bmiSeries.map(point => ({
                  recordedAt: point.recordedAt,
                  value: point.bmi,
                }))}
              />
            </section>
            <HistoryList records={dashboard.history} />
          </div>
        )}
      </div>
      <FloatingRegisterButton
        defaultHeightCm={dashboard.latest?.heightCm}
        defaultWeightKg={dashboard.latest?.weightKg}
      />
    </DefaultLayout>
  );
}
