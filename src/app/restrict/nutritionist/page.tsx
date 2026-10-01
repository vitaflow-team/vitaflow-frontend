import { NutritionistMirrorView } from '@/_components/professionalMirror/nutritionistMirrorView';
import { NoProfessionalState } from '@/_components/professionalMirror/noProfessionalState';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  hasLinkedProfessional,
  isLoadFailure,
  loadNutritionistMirror,
} from '@/_lib/professionalMirrorData';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.nutritionistMirror,
};

/** "Minha nutricionista" (US-001–US-005). */
export default async function NutritionistMirrorPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const mirror = await loadNutritionistMirror();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Title label={PAGE_TITLES.nutritionistMirror} className="text-left" />
        {isLoadFailure(mirror) ? (
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar sua nutricionista. Tente novamente mais
            tarde.
          </p>
        ) : hasLinkedProfessional(mirror) ? (
          <NutritionistMirrorView mirror={mirror} />
        ) : (
          <NoProfessionalState message="Você ainda não tem uma nutricionista vinculada." />
        )}
      </div>
    </DefaultLayout>
  );
}
