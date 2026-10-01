import { EducatorMirrorView } from '@/_components/professionalMirror/educatorMirrorView';
import { NoProfessionalState } from '@/_components/professionalMirror/noProfessionalState';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  hasLinkedProfessional,
  isLoadFailure,
  loadEducatorMirror,
} from '@/_lib/professionalMirrorData';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.educatorMirror,
};

/** "Meu educador físico" (US-001–US-005). */
export default async function EducatorMirrorPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const mirror = await loadEducatorMirror();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Title label={PAGE_TITLES.educatorMirror} className="text-left" />
        {isLoadFailure(mirror) ? (
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar seu educador físico. Tente novamente mais
            tarde.
          </p>
        ) : hasLinkedProfessional(mirror) ? (
          <EducatorMirrorView mirror={mirror} />
        ) : (
          <NoProfessionalState message="Você ainda não tem um educador físico vinculado." />
        )}
      </div>
    </DefaultLayout>
  );
}
