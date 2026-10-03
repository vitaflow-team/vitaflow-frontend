import { Breadcrumbs } from '@/_components/layout/breadcrumbs';
import { APP_ROUTES } from '@/_constants/routes';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { STUDENTS_PATH } from '@/_lib/studentsList';

interface StudentBreadcrumbProps {
  name: string;
}

/** Vita Flow › Alunos › the student: drawn here because only the record knows the name. */
export function StudentBreadcrumb({ name }: StudentBreadcrumbProps) {
  return (
    <Breadcrumbs
      items={[
        { label: 'Vita Flow', href: APP_ROUTES.ROUTE_PRIVATE },
        { label: PAGE_TITLES.students, href: STUDENTS_PATH },
        { label: name },
      ]}
    />
  );
}
