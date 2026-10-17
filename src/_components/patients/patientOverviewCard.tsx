import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatRecordedAt } from '@/_lib/formRecordDisplay';
import { patientTabHref } from '@/_lib/patientsTabs';
import type { FormRecord } from '@/_types/clinicalRecords';
import Link from 'next/link';

interface PatientOverviewCardProps {
  patientId: string;
  title: string;
  tab: 'anamnese' | 'avaliacao';
  latest: FormRecord | null;
}

/** The status of one record purpose at a glance, with a link to its tab. */
export function PatientOverviewCard({
  patientId,
  title,
  tab,
  latest,
}: PatientOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2">
        <p className="text-sm text-muted-foreground">
          {latest
            ? `Última em ${formatRecordedAt(latest.recordedAt)}.`
            : 'Nenhum registro ainda.'}
        </p>
        <Link
          href={patientTabHref(patientId, tab)}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          {latest ? 'Ver' : 'Preencher'}
        </Link>
      </CardContent>
    </Card>
  );
}
