import { AccountChip } from '@/_components/students/accountChip';
import { PATIENTS_PATH } from '@/_lib/patientsList';
import type { NutritionistPatientListItem } from '@/_types/patients';
import Link from 'next/link';

interface PatientRowProps {
  patient: NutritionistPatientListItem;
}

/** Names and e-mails are typed by users: React renders them as plain text. */
export function PatientRow({ patient }: PatientRowProps) {
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={`${PATIENTS_PATH}/${patient.id}`}
        className="flex min-h-14 flex-col gap-2 px-2 py-3 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{patient.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {patient.email}
          </p>
        </div>
        <AccountChip hasAccount={patient.hasAccount} />
      </Link>
    </li>
  );
}
