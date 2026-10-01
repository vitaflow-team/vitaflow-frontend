import { PROFESSIONAL_DISCOVERY_PATH } from '@/_lib/professionalDiscoveryTabs';
import type { ConnectionRequest } from '@/_types/professionalDiscovery';
import Link from 'next/link';
import { RequestStatusBadge } from './requestStatusBadge';

interface MyRequestsListProps {
  requests: ConnectionRequest[];
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}

// US-005: status of every request ever made; a declined one links back to
// search (AC-2), and zero requests invites a first search (EC-1) instead of
// an error.
export function MyRequestsList({ requests }: MyRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-muted-foreground text-sm">
          Você ainda não solicitou nenhum profissional.
        </p>
        <Link
          href={`${PROFESSIONAL_DISCOVERY_PATH}?tab=buscar`}
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          Buscar um profissional
        </Link>
      </div>
    );
  }

  return (
    <ul aria-label="Minhas solicitações" className="flex flex-col gap-2">
      {requests.map(request => (
        <li
          key={request.id}
          className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-semibold break-words">
              {request.professionalName}
            </span>
            <span className="text-muted-foreground text-sm">
              Solicitado em {formatDate(request.createdAt)}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <RequestStatusBadge status={request.status} />
            {request.status === 'DECLINED' && (
              <Link
                href={`${PROFESSIONAL_DISCOVERY_PATH}?tab=buscar`}
                className="text-primary text-xs underline-offset-4 hover:underline"
              >
                Buscar outro profissional
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
