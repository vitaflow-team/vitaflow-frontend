import { EmptyState } from '@/_components/progress/emptyState';
import { FloatingRegisterButton } from '@/_components/progress/floatingRegisterButton';
import { HistoryList } from '@/_components/progress/historyList';
import { PeriodSelector } from '@/_components/progress/periodSelector';
import { RecordFormModal } from '@/_components/progress/recordFormModal';
import { SummaryCards } from '@/_components/progress/summaryCards';
import { TrendChart } from '@/_components/progress/trendChart';
import { apiClient } from '@/_lib/apiClient';
import { parsePeriod } from '@/_lib/progressPeriod';
import type { DashboardResponseDTO } from '@/_types/progress';

interface MedidasTabProps {
  semanas?: string | string[];
}

// Unchanged body of the pre-tabs progress page, moved as-is under the
// "Medidas" tab (ADR: Progress Photos adds a sibling tab, not a rewrite).
export async function MedidasTab({ semanas }: MedidasTabProps) {
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
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        Não foi possível carregar sua evolução. Tente novamente mais tarde.
      </div>
    );
  }

  const { period } = dashboard;

  return (
    <>
      {dashboard.latest === null ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <RecordFormModal />
          </div>
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
      <FloatingRegisterButton />
    </>
  );
}
