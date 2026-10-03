import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { describeVariation, formatMeasure } from '@/_lib/assessmentDisplay';
import { formatIsoDay } from '@/_lib/studentsDates';
import { newAssessmentHref } from '@/_lib/studentsTabs';
import type { Assessment, StudentOverview } from '@/_types/students';
import Link from 'next/link';

interface StudentOverviewCardProps {
  studentId: string;
  overview: StudentOverview;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}

function NoAssessmentYet({ studentId }: { studentId: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3 py-6">
        <p className="text-sm text-muted-foreground">
          Nenhuma avaliação registrada ainda.
        </p>
        <Link href={newAssessmentHref(studentId)} className={buttonVariants()}>
          Nova avaliação
        </Link>
      </CardContent>
    </Card>
  );
}

function LatestMetrics({ latest }: { latest: Assessment }) {
  return (
    <>
      <dl className="grid grid-cols-3 gap-3">
        <Metric
          label="Gordura corporal"
          value={formatMeasure(latest.bodyFatPercent, '%')}
        />
        <Metric label="Peso" value={formatMeasure(latest.weightKg, 'kg')} />
        <Metric label="Altura" value={formatMeasure(latest.heightCm, 'cm')} />
      </dl>
      {latest.bodyFatPercent === null && (
        <p className="text-sm text-muted-foreground">
          Gordura corporal não registrada nesta avaliação.
        </p>
      )}
    </>
  );
}

/** The latest assessment at a glance; with none, an honest empty state. */
export function StudentOverviewCard({
  studentId,
  overview,
}: StudentOverviewCardProps) {
  const { latest, variation } = overview;
  if (!latest) return <NoAssessmentYet studentId={studentId} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Última avaliação · {formatIsoDay(latest.assessedOn)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <LatestMetrics latest={latest} />
        {variation && (
          <p className="text-sm text-muted-foreground">
            Desde a primeira avaliação —{' '}
            {describeVariation(variation).join(' · ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
