import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { StudentRiskEntry } from '@/_types/educatorDashboard';

const REASON_LABEL: Record<StudentRiskEntry['reasons'][number], string> = {
  NO_CONTACT: 'Sem contato',
  OVERDUE_PAYMENT: 'Pagamento em atraso',
};

function SeverityBadge({
  severity,
}: {
  severity: StudentRiskEntry['severity'];
}) {
  const isRed = severity === 'RED';
  return (
    <span
      className={
        isRed
          ? 'rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground'
          : 'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
      }
    >
      {isRed ? 'Alto risco' : 'Atenção'}
    </span>
  );
}

interface RiskRankingListProps {
  entries: StudentRiskEntry[];
}

export function RiskRankingList({ entries }: RiskRankingListProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Risco por aluno</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum aluno em risco no momento.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map(entry => (
              <li
                key={entry.clientId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={entry.severity} />
                  <span>{entry.clientName}</span>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-sm text-muted-foreground">
                    {entry.reasons
                      .map(reason => REASON_LABEL[reason])
                      .join(' · ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.daysSinceLastContact === null
                      ? 'Nunca teve contato registrado'
                      : `Sem contato há ${entry.daysSinceLastContact} dias`}
                  </span>
                  {!entry.billingAvailable && (
                    <span className="text-xs text-muted-foreground">
                      Cobrança não disponível
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
