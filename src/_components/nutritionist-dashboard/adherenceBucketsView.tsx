import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { PatientBucketEntry } from '@/_types/nutritionistDashboard';

interface BucketColumnProps {
  title: string;
  entries: PatientBucketEntry[];
  emptyLabel: string;
  toneClassName: string;
}

function BucketColumn({
  title,
  entries,
  emptyLabel,
  toneClassName,
}: BucketColumnProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={`text-sm font-semibold ${toneClassName}`}>
        {title} ({entries.length})
      </h3>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map(entry => (
            <li
              key={entry.clientId}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <p>{entry.clientName}</p>
              {entry.loggedDayRatio !== null && (
                <p className="text-xs text-muted-foreground">
                  {Math.round(entry.loggedDayRatio * 100)}% dos dias
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface AdherenceBucketsViewProps {
  buckets: {
    compliant: PatientBucketEntry[];
    struggling: PatientBucketEntry[];
    nonAdherent: PatientBucketEntry[];
    noDataYet: PatientBucketEntry[];
  };
}

export function AdherenceBucketsView({ buckets }: AdherenceBucketsViewProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Adesão ao diário alimentar</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BucketColumn
          title="Compliant"
          entries={buckets.compliant}
          emptyLabel="Nenhum paciente."
          toneClassName="text-emerald-700 dark:text-emerald-400"
        />
        <BucketColumn
          title="Em dificuldade"
          entries={buckets.struggling}
          emptyLabel="Nenhum paciente."
          toneClassName="text-amber-700 dark:text-amber-400"
        />
        <BucketColumn
          title="Não aderente"
          entries={buckets.nonAdherent}
          emptyLabel="Nenhum paciente."
          toneClassName="text-destructive"
        />
        <BucketColumn
          title="Sem dados ainda"
          entries={buckets.noDataYet}
          emptyLabel="Nenhum paciente."
          toneClassName="text-muted-foreground"
        />
      </CardContent>
    </Card>
  );
}
