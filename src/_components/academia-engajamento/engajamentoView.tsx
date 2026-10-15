import type { EngajamentoSummary } from '@/_types/engajamento';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface EngajamentoViewProps {
  summary: EngajamentoSummary;
}

export function EngajamentoView({ summary }: EngajamentoViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Engajamento</h1>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Check-ins hoje</p>
          <p className="text-2xl font-semibold">{summary.todayCheckInCount}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Frequência média semanal
          </p>
          <p className="text-2xl font-semibold">
            {summary.weeklyFrequencyAverage.toFixed(1)}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Alunos em risco de evasão</h2>
        {summary.atRisk.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum aluno em risco no momento.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {summary.atRisk.map(student => (
              <li
                key={student.clientId}
                className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <span>{student.name}</span>
                <span className="text-sm text-muted-foreground">
                  {student.lastCheckInAt
                    ? `Último check-in: ${formatDate(student.lastCheckInAt)}`
                    : 'Nunca fez check-in'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Check-ins recentes</h2>
        {summary.recentFeed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum check-in registrado ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {summary.recentFeed.map((entry, index) => (
              <li
                key={`${entry.clientId}-${entry.createdAt}-${index}`}
                className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex flex-col">
                  <span>{entry.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {entry.source === 'SELF' ? 'App' : 'Recepção'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                  </span>
                  {!entry.planValidAtCheckIn && (
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      Fora da validade do plano
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
