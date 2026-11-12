import type { ArchivedAccessPlan } from '@/_types/academiaMirror';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function validityLabel(entry: ArchivedAccessPlan): string {
  return entry.validityType === 'DAYS'
    ? `${entry.validityValue} dias`
    : `${entry.validityValue} visitas`;
}

// US-002: the backend already orders history newest-assignedAt-first — this
// component renders it as given, never re-sorting.
export function AccessPlanHistoryList({
  history,
}: {
  history: ArchivedAccessPlan[];
}) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum plano anterior.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-1 border-t border-line pt-2 text-sm">
      {history.map(entry => (
        <li
          key={entry.id}
          className="flex flex-wrap justify-between gap-1 text-muted-foreground"
        >
          <span>
            {entry.planName} · {validityLabel(entry)}
          </span>
          <span>
            {formatDate(entry.assignedAt)} – {formatDate(entry.endedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
