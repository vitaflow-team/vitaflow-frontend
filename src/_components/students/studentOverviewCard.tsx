import { BmiBadge } from '@/_components/clinicalRecords/bmiBadge';
import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatChange } from '@/_lib/assessmentDisplay';
import { formatFieldValue, formatRecordedAt } from '@/_lib/formRecordDisplay';
import { studentTabHref } from '@/_lib/studentsTabs';
import type { AssessmentVariation, StudentOverview } from '@/_types/students';
import type { FormRecord } from '@/_types/clinicalRecords';
import Link from 'next/link';

interface StudentOverviewCardProps {
  studentId: string;
  overview: StudentOverview;
}

function NoAssessmentYet({ studentId }: { studentId: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3 py-6">
        <p className="text-sm text-muted-foreground">
          Nenhuma avaliação registrada ainda.
        </p>
        <Link
          href={studentTabHref(studentId, 'assessment')}
          className={buttonVariants()}
        >
          Nova avaliação
        </Link>
      </CardContent>
    </Card>
  );
}

function LatestValues({ latest }: { latest: FormRecord }) {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
      {latest.values.map(value => (
        <div key={value.fieldLabel}>
          <dt className="text-muted-foreground">{value.fieldLabel}</dt>
          <dd>{formatFieldValue(value.value)}</dd>
        </div>
      ))}
    </dl>
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
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>
          Última avaliação · {formatRecordedAt(latest.recordedAt)}
        </CardTitle>
        <BmiBadge bmi={latest.bmi} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <LatestValues latest={latest} />
        {variation && (
          <p className="text-sm text-muted-foreground">
            Desde a primeira avaliação — {describeWeightVariation(variation)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function describeWeightVariation(variation: AssessmentVariation): string {
  return `Peso: ${formatChange(variation.weightKg, 'kg')}`;
}
