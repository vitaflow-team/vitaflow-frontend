import { Breadcrumbs } from '@/_components/layout/breadcrumbs';
import { APP_ROUTES } from '@/_constants/routes';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { PATIENTS_PATH } from '@/_lib/patientsList';

interface PatientBreadcrumbProps {
  name: string;
}

/** Vita Flow › Pacientes › the patient: drawn here because only the record knows the name. */
export function PatientBreadcrumb({ name }: PatientBreadcrumbProps) {
  return (
    <Breadcrumbs
      items={[
        { label: 'Vita Flow', href: APP_ROUTES.ROUTE_PRIVATE },
        { label: PAGE_TITLES.patients, href: PATIENTS_PATH },
        { label: name },
      ]}
    />
  );
}
