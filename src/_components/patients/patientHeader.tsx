import type { NutritionistPatient } from '@/_types/patients';
import { PatientBreadcrumb } from './patientBreadcrumb';
import { PatientIdentity } from './patientIdentity';

interface PatientHeaderProps {
  patient: NutritionistPatient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <PatientBreadcrumb name={patient.name} />
      <PatientIdentity patient={patient} />
    </header>
  );
}
