import { PROFESSIONAL_DISCOVERY_PATH } from '@/_lib/professionalDiscoveryTabs';
import { formatPrice, professionalTypeLabel } from '@/_lib/professionalDisplay';
import type { ProfessionalSummary } from '@/_types/professionalDiscovery';
import Link from 'next/link';

interface ProfessionalCardProps {
  professional: ProfessionalSummary;
  /** The viewer already has a pending request to this professional. */
  hasPendingRequest: boolean;
}

/** One search result row (US-001.AC-1, US-001.AC-2). */
export function ProfessionalCard({
  professional,
  hasPendingRequest,
}: ProfessionalCardProps) {
  return (
    <li className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={`${PROFESSIONAL_DISCOVERY_PATH}/${professional.id}`}
          className="font-semibold break-words underline-offset-4 hover:underline"
        >
          {professional.name}
        </Link>
        <p className="text-muted-foreground flex flex-wrap gap-x-3 text-sm">
          <span>{professionalTypeLabel(professional.type)}</span>
          <span>{professional.specialty ?? 'Especialidade não informada'}</span>
          {professional.attendsOnline && <span>Atende online</span>}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-semibold">
          {formatPrice(professional.priceFrom)}
        </span>
        {hasPendingRequest && (
          <span className="text-muted-foreground text-xs">
            Solicitação pendente
          </span>
        )}
      </div>
    </li>
  );
}
