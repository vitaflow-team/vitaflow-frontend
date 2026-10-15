'use client';

import { acceptEmploymentInvitation } from '@/_actions/educatorEmployment/acceptEmploymentInvitation';
import { declineEmploymentInvitation } from '@/_actions/educatorEmployment/declineEmploymentInvitation';
import { Button } from '@/_components/ui/button';
import { FormError } from '@/_components/students/formError';
import { Title } from '@/_components/ui/title';
import type {
  EducatorAcademiaInvitation,
  EducatorEmployment,
} from '@/_types/educatorEmployment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function InvitationRow({
  invitation,
}: {
  invitation: EducatorAcademiaInvitation;
}) {
  const router = useRouter();
  const accept = useServerAction(acceptEmploymentInvitation);
  const decline = useServerAction(declineEmploymentInvitation);
  const [error, setError] = useState<string | null>(null);
  const isPending = accept.isPending || decline.isPending;

  async function respond(action: typeof accept) {
    setError(null);
    const [, failure] = await action.execute({ id: invitation.id });
    if (failure) {
      setError(failure.message);
      return;
    }
    router.refresh();
  }

  return (
    <li className="bg-card flex flex-col gap-2 rounded-lg border px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <p className="font-medium">{invitation.academia.name}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => respond(decline)}
          >
            {decline.isPending ? 'Recusando...' : 'Recusar'}
          </Button>
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => respond(accept)}
          >
            {accept.isPending ? 'Aceitando...' : 'Aceitar'}
          </Button>
        </div>
      </div>
      <FormError message={error} />
    </li>
  );
}

interface EducatorEmploymentPanelProps {
  invitations: EducatorAcademiaInvitation[];
  employments: EducatorEmployment[];
}

export function EducatorEmploymentPanel({
  invitations,
  employments,
}: EducatorEmploymentPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Title label="Convites pendentes" size="h3" className="text-left" />
        {invitations.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum convite pendente no momento.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {invitations.map(invitation => (
              <InvitationRow key={invitation.id} invitation={invitation} />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Title
          label="Academias que me empregam"
          size="h3"
          className="text-left"
        />
        {employments.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Você não tem nenhum vínculo ativo no momento.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {employments.map(employment => (
              <li
                key={employment.id}
                className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <p className="font-medium">{employment.academia.name}</p>
                <span className="text-muted-foreground text-sm">
                  Desde {formatDate(employment.startedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
