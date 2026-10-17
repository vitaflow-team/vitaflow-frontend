import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatRecordedAt } from '@/_lib/formRecordDisplay';
import { patientTabHref, type PatientTab } from '@/_lib/patientsTabs';
import Link from 'next/link';

interface PatientOverviewCardProps {
  patientId: string;
  title: string;
  tab: PatientTab;
  /** ISO date of the latest activity for this section, or null when empty. */
  latestDate: string | null;
  emptyMessage?: string;
  fillLabel?: string;
}

/** The status of one record purpose at a glance, with a link to its tab. */
export function PatientOverviewCard({
  patientId,
  title,
  tab,
  latestDate,
  emptyMessage = 'Nenhum registro ainda.',
  fillLabel = 'Preencher',
}: PatientOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2">
        <p className="text-sm text-muted-foreground">
          {latestDate
            ? `Última em ${formatRecordedAt(latestDate)}.`
            : emptyMessage}
        </p>
        <Link
          href={patientTabHref(patientId, tab)}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          {latestDate ? 'Ver' : fillLabel}
        </Link>
      </CardContent>
    </Card>
  );
}
