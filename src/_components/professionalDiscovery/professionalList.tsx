import type { ProfessionalSummary } from '@/_types/professionalDiscovery';
import { ProfessionalCard } from './professionalCard';

interface ProfessionalListProps {
  professionals: ProfessionalSummary[];
  /** Whether any filter is currently applied. */
  filtered: boolean;
  /** Professionals the viewer already has a PENDING request to. */
  pendingProfessionalIds: Set<string>;
}

// An explicit "no results" message, never a blank area (US-001.EC-1,
// US-002.EC-1) — the copy differs only to tell a narrowed search apart from
// an unfiltered catalog that happens to be empty.
export function ProfessionalList({
  professionals,
  filtered,
  pendingProfessionalIds,
}: ProfessionalListProps) {
  if (professionals.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {filtered
          ? 'Nenhum profissional encontrado para esses filtros.'
          : 'Nenhum profissional disponível no momento.'}
      </p>
    );
  }

  return (
    <ul aria-label="Profissionais" className="flex flex-col gap-2">
      {professionals.map(professional => (
        <ProfessionalCard
          key={professional.id}
          professional={professional}
          hasPendingRequest={pendingProfessionalIds.has(professional.id)}
        />
      ))}
    </ul>
  );
}
