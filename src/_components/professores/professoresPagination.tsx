import { buttonVariants } from '@/_components/ui/button';
import {
  professoresHref,
  totalPages,
  type ProfessoresParams,
} from '@/_lib/professoresList';
import Link from 'next/link';

interface ProfessoresPaginationProps {
  search?: string;
  page: number;
  total: number;
  pageSize: number;
}

function PageLink({
  label,
  params,
}: {
  label: string;
  params: ProfessoresParams;
}) {
  return (
    <Link
      href={professoresHref(params)}
      className={buttonVariants({ variant: 'outline' })}
    >
      {label}
    </Link>
  );
}

export function ProfessoresPagination({
  search,
  page,
  total,
  pageSize,
}: ProfessoresPaginationProps) {
  const pages = totalPages(total, pageSize);
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Paginação de professores"
      className="flex items-center justify-between gap-2 pt-4"
    >
      {page > 1 ? (
        <PageLink label="Anterior" params={{ search, page: page - 1 }} />
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <PageLink label="Próxima" params={{ search, page: page + 1 }} />
      ) : (
        <span />
      )}
    </nav>
  );
}
