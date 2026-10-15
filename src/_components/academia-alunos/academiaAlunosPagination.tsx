import { buttonVariants } from '@/_components/ui/button';
import {
  academiaAlunosHref,
  totalPages,
  type AcademiaAlunosParams,
} from '@/_lib/academiaAlunosList';
import Link from 'next/link';

interface AcademiaAlunosPaginationProps {
  search?: string;
  horario: AcademiaAlunosParams['horario'];
  page: number;
  total: number;
  pageSize: number;
}

function PageLink({
  label,
  params,
}: {
  label: string;
  params: AcademiaAlunosParams;
}) {
  return (
    <Link
      href={academiaAlunosHref(params)}
      className={buttonVariants({ variant: 'outline' })}
    >
      {label}
    </Link>
  );
}

export function AcademiaAlunosPagination({
  search,
  horario,
  page,
  total,
  pageSize,
}: AcademiaAlunosPaginationProps) {
  const pages = totalPages(total, pageSize);
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Paginação de alunos"
      className="flex items-center justify-between gap-2 pt-4"
    >
      {page > 1 ? (
        <PageLink
          label="Anterior"
          params={{ search, horario, page: page - 1 }}
        />
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <PageLink
          label="Próxima"
          params={{ search, horario, page: page + 1 }}
        />
      ) : (
        <span />
      )}
    </nav>
  );
}
