import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { EducatorDashboardCounters } from '@/_types/educatorDashboard';

interface CountersCardProps {
  counters: EducatorDashboardCounters;
}

export function CountersCard({ counters }: CountersCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="text-base">Carteira de alunos</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Ativos</p>
          <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
            {counters.activeCount}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Inativos</p>
          <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
            {counters.inactiveCount}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold">{counters.totalCount}</p>
        </div>
      </CardContent>
    </Card>
  );
}
