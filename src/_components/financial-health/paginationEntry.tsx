import type { PaginationItem } from '@/_types/paginationItem';
import { PaginationLink } from './paginationLink';

interface PaginationEntryProps {
  item: PaginationItem;
  currentPage: number;
  hrefOf: (page: number) => string;
}

/** One numbered link of the pager, or the gap between two runs of pages. */
export function PaginationEntry({
  item,
  currentPage,
  hrefOf,
}: PaginationEntryProps) {
  if (item.kind === 'gap') return <span aria-hidden="true">…</span>;

  return (
    <PaginationLink
      href={hrefOf(item.page)}
      label={String(item.page)}
      ariaLabel={`Página ${item.page}`}
      current={item.page === currentPage}
    />
  );
}
