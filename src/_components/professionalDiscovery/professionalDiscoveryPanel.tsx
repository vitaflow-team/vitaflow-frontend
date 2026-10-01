import { isLoadFailure } from '@/_lib/professionalDiscoveryData';
import { hasActiveFilter } from '@/_lib/professionalFilter';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  ConnectionRequest,
  ProfessionalProfile,
  ProfessionalSummary,
} from '@/_types/professionalDiscovery';
import type { ProfessionalFilter } from '@/_types/professionalFilter';
import type { ProfessionalDiscoveryTab } from '@/_lib/professionalDiscoveryTabs';
import { IncomingRequestsList } from './incomingRequestsList';
import { MyRequestsList } from './myRequestsList';
import { ProfessionalList } from './professionalList';
import { ProfileEditForm } from './profileEditForm';
import { SearchFilters } from './searchFilters';

interface ProfessionalDiscoveryPanelProps {
  tab: ProfessionalDiscoveryTab;
  filter: ProfessionalFilter;
  professionals: ProfessionalSummary[] | LoadFailure | null;
  myRequests: ConnectionRequest[] | LoadFailure | null;
  incomingRequests: ConnectionRequest[] | LoadFailure | null;
  myProfile: ProfessionalProfile | LoadFailure | null;
}

function LoadFailureNotice({ message }: { message: string }) {
  return <p className="text-muted-foreground text-sm">{message}</p>;
}

/**
 * Content of the selected tab, mirroring SettingsPanel's shape: a load
 * failure replaces only this content, the tab strip stays up.
 */
export function ProfessionalDiscoveryPanel({
  tab,
  filter,
  professionals,
  myRequests,
  incomingRequests,
  myProfile,
}: ProfessionalDiscoveryPanelProps) {
  if (tab === 'buscar') {
    const pendingIds = new Set(
      myRequests && !isLoadFailure(myRequests)
        ? myRequests
            .filter(request => request.status === 'PENDING')
            .map(request => request.professionalId)
        : []
    );

    return (
      <>
        <SearchFilters filter={filter} />
        {!professionals || isLoadFailure(professionals) ? (
          <LoadFailureNotice message="Não foi possível carregar os profissionais. Tente novamente mais tarde." />
        ) : (
          <ProfessionalList
            professionals={professionals}
            filtered={hasActiveFilter(filter)}
            pendingProfessionalIds={pendingIds}
          />
        )}
      </>
    );
  }

  if (tab === 'solicitacoes') {
    if (!myRequests || isLoadFailure(myRequests)) {
      return (
        <LoadFailureNotice message="Não foi possível carregar suas solicitações. Tente novamente mais tarde." />
      );
    }
    return <MyRequestsList requests={myRequests} />;
  }

  if (tab === 'recebidas') {
    if (!incomingRequests || isLoadFailure(incomingRequests)) {
      return (
        <LoadFailureNotice message="Não foi possível carregar as solicitações recebidas. Tente novamente mais tarde." />
      );
    }
    return <IncomingRequestsList requests={incomingRequests} />;
  }

  if (!myProfile || isLoadFailure(myProfile)) {
    return (
      <LoadFailureNotice message="Não foi possível carregar seu perfil. Tente novamente mais tarde." />
    );
  }
  return <ProfileEditForm profile={myProfile} />;
}
