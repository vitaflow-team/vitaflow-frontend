import type { ConnectionRequest } from '@/_types/professionalDiscovery';
import { RequestDecisionActions } from './requestDecisionActions';

interface IncomingRequestsListProps {
  requests: ConnectionRequest[];
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}

// US-007: every pending request addressed to the viewer, each with the
// requester's name and when it arrived; zero requests is an empty state,
// not an error (EC-1).
export function IncomingRequestsList({ requests }: IncomingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhuma solicitação pendente no momento.
      </p>
    );
  }

  return (
    <ul aria-label="Solicitações recebidas" className="flex flex-col gap-2">
      {requests.map(request => (
        <li
          key={request.id}
          className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-semibold break-words">
              {request.userName}
            </span>
            <span className="text-muted-foreground text-sm">
              Solicitado em {formatDate(request.createdAt)}
            </span>
          </div>
          <RequestDecisionActions
            requestId={request.id}
            requesterName={request.userName}
          />
        </li>
      ))}
    </ul>
  );
}
