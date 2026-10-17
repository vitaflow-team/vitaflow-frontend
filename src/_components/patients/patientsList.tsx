import type { NutritionistPatientListItem } from '@/_types/patients';
import { PatientRow } from './patientRow';

interface PatientsListProps {
  patients: NutritionistPatientListItem[];
}

export function PatientsList({ patients }: PatientsListProps) {
  return (
    <ul aria-label="Pacientes" className="flex flex-col">
      {patients.map(patient => (
        <PatientRow key={patient.id} patient={patient} />
      ))}
    </ul>
  );
}
