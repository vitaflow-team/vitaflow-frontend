import { BmiTrendChart } from '@/_components/progress/bmiTrendChart';
import { EmptyState } from '@/_components/progress/emptyState';
import { HistoryList } from '@/_components/progress/historyList';
import { RecordFormModal } from '@/_components/progress/recordFormModal';
import { SummaryCards } from '@/_components/progress/summaryCards';
import { WeightTrendChart } from '@/_components/progress/weightTrendChart';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { apiClient } from '@/_lib/apiClient';
import type { DashboardResponseDTO } from '@/_types/progress';
import { auth } from '@/auth';

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  let dashboard: DashboardResponseDTO;
  try {
    dashboard = await apiClient<DashboardResponseDTO>(
      '/progress-records/dashboard',
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

  return (
    <DefaultLayout>
      <header className="flex flex-col gap-3 border-b border-primary pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Minha Evolução</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas medidas e tendências das últimas 8 semanas.
          </p>
        </div>
        {dashboard.latest && (
          <RecordFormModal defaultHeightCm={dashboard.latest.heightCm} />
        )}
      </header>

      {dashboard.latest === null ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          <SummaryCards
            latest={dashboard.latest}
            weightVariationKg={dashboard.weightVariationKg}
          />
          <section
            aria-label="Tendências das últimas 8 semanas"
            className="grid min-w-0 gap-4 xl:grid-cols-2"
          >
            <WeightTrendChart
              data={dashboard.weightSeries.map(point => ({
                recordedAt: point.recordedAt,
                value: point.weightKg,
              }))}
            />
            <BmiTrendChart
              data={dashboard.bmiSeries.map(point => ({
                recordedAt: point.recordedAt,
                value: point.bmi,
              }))}
            />
          </section>
          <HistoryList records={dashboard.history} />
        </div>
      )}
    </DefaultLayout>
  );
}
