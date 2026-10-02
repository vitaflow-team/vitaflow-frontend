import { AvailabilityForm } from '@/_components/scheduling/availabilityForm';
import { AvailabilityList } from '@/_components/scheduling/availabilityList';
import { EligibleProfessionalsList } from '@/_components/scheduling/eligibleProfessionalsList';
import { UpcomingSlotsList } from '@/_components/scheduling/upcomingSlotsList';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadEligibleCounterparts } from '@/_lib/messagesData';
import {
  isLoadFailure,
  loadMyAvailability,
  loadUpcoming,
} from '@/_lib/schedulingData';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.scheduling,
};

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

export default async function SchedulingPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const isProfessional = PROFESSIONAL_TYPES.includes(
    session.user.productType ?? ''
  );

  const upcoming = await loadUpcoming();
  const upcomingSlots = isLoadFailure(upcoming) ? [] : upcoming;

  if (isProfessional) {
    const windows = await loadMyAvailability();

    return (
      <DefaultLayout>
        <div className="flex flex-col gap-8">
          <header className="border-b border-primary pb-3">
            <h1 className="text-2xl font-semibold">Agenda</h1>
            <p className="text-sm text-muted-foreground">
              Publique sua disponibilidade e acompanhe suas sessões.
            </p>
          </header>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Disponibilidade</h2>
            <AvailabilityForm />
            <AvailabilityList windows={isLoadFailure(windows) ? [] : windows} />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Próximas sessões</h2>
            <UpcomingSlotsList slots={upcomingSlots} viewerIsProfessional />
          </section>
        </div>
      </DefaultLayout>
    );
  }

  const eligible = await loadEligibleCounterparts(false);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-8">
        <header className="border-b border-primary pb-3">
          <h1 className="text-2xl font-semibold">Agendar horário</h1>
          <p className="text-sm text-muted-foreground">
            Marque uma sessão com quem você tem um vínculo ativo.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Profissionais</h2>
          <EligibleProfessionalsList
            professionals={isLoadFailure(eligible) ? [] : eligible}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Minhas sessões</h2>
          <UpcomingSlotsList
            slots={upcomingSlots}
            viewerIsProfessional={false}
          />
        </section>
      </div>
    </DefaultLayout>
  );
}
