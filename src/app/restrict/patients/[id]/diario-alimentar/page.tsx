import { FoodDiarySection } from '@/_components/professionalFoodDiary/foodDiarySection';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadFoodDiary } from '@/_lib/professionalFoodDiaryData';
import { loadPatient } from '@/_lib/patientsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientFoodDiary,
};

interface PatientFoodDiaryPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientFoodDiaryPage({
  params,
}: PatientFoodDiaryPageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  const diary = await loadFoodDiary(patient.id);
  if (isLoadFailure(diary)) {
    return (
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar o diário alimentar. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  return <FoodDiarySection diary={diary} />;
}
