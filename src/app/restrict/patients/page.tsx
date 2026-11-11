import DefaultLayout from '@/_components/layout/defaultLayout';
import { NutritionistDashboardView } from '@/_components/nutritionist-dashboard/nutritionistDashboardView';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadNutritionistDashboard,
} from '@/_lib/nutritionistDashboardData';
import { redirectUnlessNutritionist } from '@/_lib/patientsAuthorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patients,
};

/**
 * The nutritionist's portfolio dashboard — the default landing view for
 * "Pacientes" (ADR-007). The previous flat list moved to
 * `/restrict/patients/lista`, linked from the dashboard below.
 */
export default async function PatientsPage() {
  await redirectUnlessNutritionist();
  const summary = await loadNutritionistDashboard();

  return (
    <DefaultLayout>
      {isLoadFailure(summary) ? (
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o painel de pacientes. Tente novamente em
          alguns instantes.
        </p>
      ) : (
        <NutritionistDashboardView summary={summary} />
      )}
    </DefaultLayout>
  );
}
