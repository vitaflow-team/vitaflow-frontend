import type { PaginationItem } from '@/_types/paginationItem';

const WINDOW = 1;
const ALL_PAGES_LIMIT = 7;

function pageItem(page: number): PaginationItem {
  return { kind: 'page', page };
}

/**
 * Page links for a list of `totalPages`: every page while there are few, else
 * the first, the last and the current page with its neighbours, with a gap
 * wherever pages are skipped.
 */
export function paginationItems(
  page: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= ALL_PAGES_LIMIT) {
    return Array.from({ length: totalPages }, (_, index) =>
      pageItem(index + 1)
    );
  }

  const shown = new Set([1, totalPages]);
  for (let near = page - WINDOW; near <= page + WINDOW; near++) {
    if (near >= 1 && near <= totalPages) shown.add(near);
  }

  const items: PaginationItem[] = [];
  let previous = 0;
  for (const current of [...shown].sort((a, b) => a - b)) {
    if (current - previous > 1) items.push({ kind: 'gap' });
    items.push(pageItem(current));
    previous = current;
  }
  return items;
}
