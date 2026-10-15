import { ComingSoon } from '@/_components/layout/comingSoon';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectUnlessReceptionist } from '@/_lib/academiaAuthorization';
import { ScanLine } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaCheckin,
};

export default async function AcademiaCheckinPage() {
  await redirectUnlessReceptionist();

  return (
    <DefaultLayout>
      <ComingSoon
        title="Check-in ainda não está disponível"
        message="O registro de check-in chega em uma etapa futura."
        icon={ScanLine}
      />
    </DefaultLayout>
  );
}
