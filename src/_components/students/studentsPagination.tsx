import { buttonVariants } from '@/_components/ui/button';
import {
  studentsHref,
  totalPages,
  type StudentsParams,
} from '@/_lib/studentsList';
import Link from 'next/link';

interface StudentsPaginationProps {
  search?: string;
  order?: 'name';
  page: number;
  total: number;
  pageSize: number;
}

function PageLink({
  label,
  params,
}: {
  label: string;
  params: StudentsParams;
}) {
  return (
    <Link
      href={studentsHref(params)}
      className={buttonVariants({ variant: 'outline' })}
    >
      {label}
    </Link>
  );
}

/** Previous and next as real links, so the address stays shareable. */
export function StudentsPagination({
  search,
  order,
  page,
  total,
  pageSize,
}: StudentsPaginationProps) {
  const pages = totalPages(total, pageSize);
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Paginação de alunos"
      className="flex items-center justify-between gap-2 pt-4"
    >
      {page > 1 ? (
        <PageLink label="Anterior" params={{ search, order, page: page - 1 }} />
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <PageLink label="Próxima" params={{ search, order, page: page + 1 }} />
      ) : (
        <span />
      )}
    </nav>
  );
}
