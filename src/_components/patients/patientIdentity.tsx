import { AccountChip } from '@/_components/students/accountChip';
import type { NutritionistPatient } from '@/_types/patients';

interface PatientIdentityProps {
  patient: NutritionistPatient;
}

/** Name, contact and the account chip. */
export function PatientIdentity({ patient }: PatientIdentityProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h1 className="truncate text-2xl font-semibold">{patient.name}</h1>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {patient.email && (
          <span className="min-w-0 truncate">{patient.email}</span>
        )}
        {patient.phone && (
          <span className="min-w-0 truncate">{patient.phone}</span>
        )}
        <AccountChip hasAccount={patient.hasAccount} />
      </div>
    </div>
  );
}
