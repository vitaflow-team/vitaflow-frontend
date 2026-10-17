import { MealPlanSection } from '@/_components/mealPlan/mealPlanSection';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadDraft, loadVersions } from '@/_lib/mealPlanData';
import { loadPatient } from '@/_lib/patientsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientMealPlan,
};

interface PatientMealPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientMealPlanPage({
  params,
}: PatientMealPlanPageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  const [draft, versions] = await Promise.all([
    loadDraft(patient.id),
    loadVersions(patient.id),
  ]);

  if (isLoadFailure(draft) || isLoadFailure(versions)) {
    return (
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar o plano alimentar. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return (
    <MealPlanSection clientId={patient.id} draft={draft} versions={versions} />
  );
}
