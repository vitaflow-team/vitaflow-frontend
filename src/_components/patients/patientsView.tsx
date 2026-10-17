import type { NutritionistPatientList } from '@/_types/patients';
import { AddPatientPanel } from './addPatientPanel';
import { PatientSearch } from './patientSearch';
import { PatientsEmptyState } from './patientsEmptyState';
import { PatientsList } from './patientsList';
import { PatientsNoResults } from './patientsNoResults';

interface PatientsViewProps {
  list: NutritionistPatientList;
  search?: string;
}

function PatientsContent({ list, search }: PatientsViewProps) {
  if (list.total === 0) {
    return search ? (
      <PatientsNoResults search={search} />
    ) : (
      <PatientsEmptyState />
    );
  }

  return <PatientsList patients={list.items} />;
}

/** The nutritionist's patient list: header, add action, search and the right state. */
export function PatientsView({ list, search }: PatientsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Pacientes</h1>
        <AddPatientPanel />
      </div>
      <PatientSearch initialQuery={search ?? ''} />
      <PatientsContent list={list} search={search} />
    </div>
  );
}
