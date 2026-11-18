import { DELINQUENTS_ANCHOR } from '@/_constants/financialHealth';
import { panelHref } from '@/_lib/financialHealthParams';
import { paginationItems } from '@/_lib/financialPaginationItems';
import { PaginationEntry } from './paginationEntry';
import { PaginationLink } from './paginationLink';

interface DelinquentsPaginationProps {
  path: string;
  month: string;
  page: number;
  total: number;
  pageSize: number;
}

/** Links to the pages of the delinquent list, keeping the chosen month. */
export function DelinquentsPagination({
  path,
  month,
  page,
  total,
  pageSize,
}: DelinquentsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const hrefOf = (target: number) =>
    `${panelHref(path, { month, page: target })}#${DELINQUENTS_ANCHOR}`;

  return (
    <nav aria-label="Paginação da lista de inadimplentes">
      <ul className="flex flex-wrap items-center gap-1">
        {page > 1 && (
          <li>
            <PaginationLink
              href={hrefOf(page - 1)}
              label="Anterior"
              ariaLabel="Página anterior"
            />
          </li>
        )}
        {paginationItems(page, totalPages).map((item, index) => (
          <li key={item.kind === 'page' ? item.page : `gap-${index}`}>
            <PaginationEntry item={item} currentPage={page} hrefOf={hrefOf} />
          </li>
        ))}
        {page < totalPages && (
          <li>
            <PaginationLink
              href={hrefOf(page + 1)}
              label="Próxima"
              ariaLabel="Próxima página"
            />
          </li>
        )}
      </ul>
    </nav>
  );
}
