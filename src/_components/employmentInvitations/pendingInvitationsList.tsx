import type { EducatorAcademiaInvitation } from '@/_types/educatorEmployment';
import { InvitationDecisionActions } from './invitationDecisionActions';

interface PendingInvitationsListProps {
  invitations: EducatorAcademiaInvitation[];
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}

export function PendingInvitationsList({
  invitations,
}: PendingInvitationsListProps) {
  if (invitations.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhum convite pendente no momento.
      </p>
    );
  }

  return (
    <ul aria-label="Convites recebidos" className="flex flex-col gap-2">
      {invitations.map(invitation => (
        <li
          key={invitation.id}
          className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-semibold break-words">
              {invitation.academia.name}
            </span>
            <span className="text-muted-foreground text-sm">
              Convidado em {formatDate(invitation.createdAt)}
            </span>
          </div>
          <InvitationDecisionActions
            invitationId={invitation.id}
            academiaName={invitation.academia.name}
          />
        </li>
      ))}
    </ul>
  );
}
