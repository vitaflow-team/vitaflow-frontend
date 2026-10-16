import type {
  AuditLogEntry,
  AuditLogListResult,
} from '@/_types/backofficeAuditLog';

interface AuditLogViewProps {
  result: AuditLogListResult;
}

function formatMoment(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  return (
    <li className="flex flex-col gap-1 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium">
          {entry.staffName} viu como {entry.targetName ?? 'conta removida'}
        </span>
        <span className="text-muted-foreground text-xs">
          {formatMoment(entry.startedAt)} —{' '}
          {entry.endedAt ? formatMoment(entry.endedAt) : 'em andamento'}
        </span>
      </div>
      <span className="text-muted-foreground text-sm">
        Motivo: {entry.reason}
      </span>
    </li>
  );
}

/** Complete audit trail of every "ver como" session (US-011, US-011.EC-1). */
export function AuditLogView({ result }: AuditLogViewProps) {
  if (result.items.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhuma sessão &quot;ver como&quot; registrada ainda.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-md border">
      {result.items.map(entry => (
        <AuditLogRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}
