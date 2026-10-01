import { ProfessionalDiscoveryPanel } from '@/_components/professionalDiscovery/professionalDiscoveryPanel';
import { ProfessionalDiscoveryTabs } from '@/_components/professionalDiscovery/professionalDiscoveryTabs';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  loadIncomingRequests,
  loadMyRequests,
  loadProfessionalProfile,
  loadProfessionals,
} from '@/_lib/professionalDiscoveryData';
import {
  availableTabs,
  parseProfessionalDiscoveryTab,
  professionalDiscoveryPanelId,
  professionalDiscoveryTabId,
  type ProfessionalDiscoveryTab,
} from '@/_lib/professionalDiscoveryTabs';
import { parseProfessionalFilter } from '@/_lib/professionalFilter';
import type { ProfessionalFilter } from '@/_types/professionalFilter';
import type { ProfessionalSearchParams } from '@/_types/professionalSearchParams';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.professionals,
};

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

interface ProfessionalsPageProps {
  searchParams: Promise<ProfessionalSearchParams>;
}

/** Only the active tab's data is fetched from the backend. */
function loadTabData(
  tab: ProfessionalDiscoveryTab,
  filter: ProfessionalFilter,
  userId: string
) {
  return Promise.all([
    tab === 'buscar' ? loadProfessionals(filter) : Promise.resolve(null),
    tab === 'buscar' || tab === 'solicitacoes'
      ? loadMyRequests()
      : Promise.resolve(null),
    tab === 'recebidas' ? loadIncomingRequests() : Promise.resolve(null),
    tab === 'perfil' ? loadProfessionalProfile(userId) : Promise.resolve(null),
  ] as const);
}

/** Search, "minhas solicitações", and — for professional accounts — the
 * incoming-request queue and own profile edit, all under one page/tab shell. */
export default async function ProfessionalsPage({
  searchParams,
}: ProfessionalsPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const params = await searchParams;
  const isProfessional = PROFESSIONAL_TYPES.includes(
    session.user.productType ?? ''
  );
  const tab = parseProfessionalDiscoveryTab(params.tab, isProfessional);
  const tabs = availableTabs(isProfessional);
  const filter = parseProfessionalFilter(params);
  const [professionals, myRequests, incomingRequests, myProfile] =
    await loadTabData(tab, filter, session.user.id);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Title label={PAGE_TITLES.professionals} className="text-left" />
        <ProfessionalDiscoveryTabs tabs={tabs} selected={tab} />
        <div
          role="tabpanel"
          id={professionalDiscoveryPanelId(tab)}
          aria-labelledby={professionalDiscoveryTabId(tab)}
          tabIndex={0}
          className="flex flex-col gap-4 pt-2 focus-visible:outline-hidden"
        >
          <ProfessionalDiscoveryPanel
            tab={tab}
            filter={filter}
            professionals={professionals}
            myRequests={myRequests}
            incomingRequests={incomingRequests}
            myProfile={myProfile}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
