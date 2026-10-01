import { ProfessionalProfileDetail } from '@/_components/professionalDiscovery/professionalProfileDetail';
import { RequestConnectionButton } from '@/_components/professionalDiscovery/requestConnectionButton';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  isLoadFailure,
  loadMyRequests,
  loadProfessionalProfile,
} from '@/_lib/professionalDiscoveryData';
import { PROFESSIONAL_DISCOVERY_PATH } from '@/_lib/professionalDiscoveryTabs';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: PAGE_TITLES.professionalProfile,
};

interface ProfessionalProfilePageProps {
  params: Promise<{ id: string }>;
}

/** US-003: a professional's public profile, with the request-to-connect action. */
export default async function ProfessionalProfilePage({
  params,
}: ProfessionalProfilePageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const [profile, myRequests] = await Promise.all([
    loadProfessionalProfile(id),
    loadMyRequests(),
  ]);

  if (profile === 'not-found') notFound();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Link
          href={PROFESSIONAL_DISCOVERY_PATH}
          className="text-primary w-fit text-sm underline-offset-4 hover:underline"
        >
          ← Voltar para a busca
        </Link>
        {isLoadFailure(profile) ? (
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar o perfil. Tente novamente mais tarde.
          </p>
        ) : (
          <>
            <ProfessionalProfileDetail profile={profile} />
            <RequestConnectionButton
              professionalId={profile.id}
              professionalName={profile.name}
              hasPendingRequest={
                !isLoadFailure(myRequests) &&
                myRequests.some(
                  request =>
                    request.professionalId === profile.id &&
                    request.status === 'PENDING'
                )
              }
            />
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
