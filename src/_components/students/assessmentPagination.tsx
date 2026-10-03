import { buttonVariants } from '@/_components/ui/button';
import { totalPages } from '@/_lib/studentsList';
import { studentTabHref } from '@/_lib/studentsTabs';
import Link from 'next/link';

interface AssessmentPaginationProps {
  studentId: string;
  page: number;
  total: number;
  pageSize: number;
}

function pageHref(studentId: string, page: number): string {
  const base = studentTabHref(studentId, 'assessment');
  return page > 1 ? `${base}?page=${page}` : base;
}

/** More than a page of history shows how to reach the rest; nothing is dropped. */
export function AssessmentPagination({
  studentId,
  page,
  total,
  pageSize,
}: AssessmentPaginationProps) {
  const pages = totalPages(total, pageSize);
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Páginas do histórico"
      className="flex items-center justify-between gap-2 pt-4"
    >
      {page > 1 ? (
        <Link
          href={pageHref(studentId, page - 1)}
          className={buttonVariants({ variant: 'outline' })}
        >
          Avaliações mais recentes
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <Link
          href={pageHref(studentId, page + 1)}
          className={buttonVariants({ variant: 'outline' })}
        >
          Avaliações mais antigas
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
