import { AcademiaMembershipCard } from '@/_components/academiaMirror/academiaMembershipCard';
import { NoAcademiaMembershipState } from '@/_components/academiaMirror/noAcademiaMembershipState';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadAcademiaMirror } from '@/_lib/academiaMirrorData';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.academiaMirror,
};

/** "Minha academia" (US-001, US-002). */
export default async function AcademiaMirrorPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const memberships = await loadAcademiaMirror();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Title label={PAGE_TITLES.academiaMirror} className="text-left" />
        {isLoadFailure(memberships) ? (
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar suas academias. Tente novamente mais
            tarde.
          </p>
        ) : memberships.length === 0 ? (
          <NoAcademiaMembershipState />
        ) : (
          <div className="flex flex-col gap-4">
            {memberships.map(membership => (
              <AcademiaMembershipCard
                key={membership.academiaId}
                membership={membership}
              />
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
