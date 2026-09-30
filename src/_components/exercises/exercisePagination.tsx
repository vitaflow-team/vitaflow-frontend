import { Button } from '@/_components/ui/button';
import { EXERCISE_PAGE_SIZE } from '@/_constants/exerciseCatalog';
import { toAddressQuery } from '@/_lib/exerciseFilter';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import Link from 'next/link';

interface ExercisePaginationProps {
  filter: ExerciseFilter;
  /** How many exercises the current page returned. */
  count: number;
  basePath: string;
}

/**
 * The backend returns fixed pages of 50 without a total, so a full page is
 * the signal that another may follow (US-001.AC-3, EC-3).
 */
export function ExercisePagination({
  filter,
  count,
  basePath,
}: ExercisePaginationProps) {
  const hasPrevious = filter.page > 1;
  const hasNext = count >= EXERCISE_PAGE_SIZE;
  if (!hasPrevious && !hasNext) return null;

  const pageLink = (page: number) =>
    `${basePath}${toAddressQuery({ ...filter, page })}`;

  return (
    <nav
      aria-label="Paginação dos exercícios"
      className="flex items-center justify-between gap-2"
    >
      {hasPrevious ? (
        <Button asChild variant="outline">
          <Link href={pageLink(filter.page - 1)}>Página anterior</Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-muted-foreground text-sm">
        Página {filter.page}
      </span>
      {hasNext ? (
        <Button asChild variant="outline">
          <Link href={pageLink(filter.page + 1)}>Próxima página</Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
