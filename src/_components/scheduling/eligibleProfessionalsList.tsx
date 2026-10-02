import type { EligibleCounterpart } from '@/_types/messages';
import Link from 'next/link';

interface EligibleProfessionalsListProps {
  professionals: EligibleCounterpart[];
}

/** US-006.EC-2: booking requires an active relationship — the same one
 * Messages already established. No relationship, no booking target. */
export function EligibleProfessionalsList({
  professionals,
}: EligibleProfessionalsListProps) {
  if (professionals.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-muted-foreground text-sm">
          Você ainda não tem nenhum profissional vinculado para agendar.
        </p>
        <Link
          href="/restrict/professionals"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          Buscar um profissional
        </Link>
      </div>
    );
  }

  return (
    <ul aria-label="Profissionais vinculados" className="flex flex-col gap-2">
      {professionals.map(professional => (
        <li key={professional.id}>
          <Link
            href={`/restrict/scheduling/book/${professional.id}`}
            className="bg-card flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
          >
            <span className="font-semibold">{professional.name}</span>
            <span className="text-primary text-sm">Ver horários</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
