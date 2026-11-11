import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { PatientBucketEntry } from '@/_types/nutritionistDashboard';

interface NoDiaryEntryAlertsListProps {
  entries: PatientBucketEntry[];
}

export function NoDiaryEntryAlertsList({
  entries,
}: NoDiaryEntryAlertsListProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="text-base">Sem registro no diário</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum paciente sinalizado.
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
                  {entry.daysSinceLastEntry === null
                    ? 'Nunca registrou'
                    : `${entry.daysSinceLastEntry} dias`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
