import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PaginationEntry } from './paginationEntry';

const hrefOf = (page: number) => `/restrict/financeiro?page=${page}`;

describe('PaginationEntry', () => {
  it('links a page and marks it current only when it is the page on screen', () => {
    const current = renderToStaticMarkup(
      <PaginationEntry
        item={{ kind: 'page', page: 3 }}
        currentPage={3}
        hrefOf={hrefOf}
      />
    );
    const other = renderToStaticMarkup(
      <PaginationEntry
        item={{ kind: 'page', page: 4 }}
        currentPage={3}
        hrefOf={hrefOf}
      />
    );

    expect(current).toContain('aria-current="page"');
    expect(current).toContain('href="/restrict/financeiro?page=3"');
    expect(other).not.toContain('aria-current');
    expect(other).toContain('aria-label="Página 4"');
  });

  it('draws a gap as decoration, not as a link', () => {
    const html = renderToStaticMarkup(
      <PaginationEntry item={{ kind: 'gap' }} currentPage={1} hrefOf={hrefOf} />
    );

    expect(html).toBe('<span aria-hidden="true">…</span>');
  });
});
