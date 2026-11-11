import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { StudentRiskEntry } from '@/_types/educatorDashboard';

interface NoContactAlertsListProps {
  entries: StudentRiskEntry[];
}

export function NoContactAlertsList({ entries }: NoContactAlertsListProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="text-base">Sem contato recente</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum aluno sinalizado.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map(entry => (
              <li
                key={entry.clientId}
                className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
              >
                <span>{entry.clientName}</span>
                <span className="text-sm text-muted-foreground">
                  {entry.daysSinceLastContact === null
                    ? 'Nunca teve contato registrado'
                    : `${entry.daysSinceLastContact} dias`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
