import { buttonVariants } from '@/_components/ui/button';
import { totalPages } from '@/_lib/studentsList';
import { workoutsHref } from '@/_lib/workoutLinks';
import Link from 'next/link';

interface ArchivedPaginationProps {
  studentId: string;
  page: number;
  total: number;
  pageSize: number;
}

/** More than a page of archived workouts: a way to reach the rest, nothing cut off. */
export function ArchivedPagination({
  studentId,
  page,
  total,
  pageSize,
}: ArchivedPaginationProps) {
  const pages = totalPages(total, pageSize);
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Páginas dos treinos arquivados"
      className="flex items-center justify-between gap-2 pt-2"
    >
      {page > 1 ? (
        <Link
          href={workoutsHref(studentId, page - 1)}
          className={buttonVariants({ variant: 'outline' })}
        >
          Mais recentes
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <Link
          href={workoutsHref(studentId, page + 1)}
          className={buttonVariants({ variant: 'outline' })}
        >
          Mais antigos
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
