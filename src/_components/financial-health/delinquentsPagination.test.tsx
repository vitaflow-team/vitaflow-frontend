import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DelinquentsPagination } from './delinquentsPagination';

const BASE = {
  path: '/restrict/financeiro',
  month: '2026-03',
  pageSize: 20,
};

function render(page: number, total: number) {
  return renderToStaticMarkup(
    <DelinquentsPagination {...BASE} page={page} total={total} />
  );
}

describe('DelinquentsPagination', () => {
  it('UT-150 renders a link for each page with aria-current on the active one', () => {
    const html = render(2, 55);

    expect(html).toContain(
      '<nav aria-label="Paginação da lista de inadimplentes"'
    );
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-current="page"[^>]*>2<\/a>/);
    for (const page of [1, 2, 3]) {
      expect(html).toContain(`aria-label="Página ${page}"`);
    }
  });

  it('UT-150 uses real links, so every page is reachable by keyboard', () => {
    const html = render(2, 55);

    expect(html.match(/<a /g)?.length).toBeGreaterThanOrEqual(5);
    expect(html).not.toContain('tabindex="-1"');
    expect(html).not.toContain('<button');
  });

  it('keeps the month in every link and lands on the list', () => {
    const html = render(1, 55);

    expect(html).toContain(
      'href="/restrict/financeiro?month=2026-03#inadimplentes"'
    );
    expect(html).toContain(
      'href="/restrict/financeiro?month=2026-03&amp;page=3#inadimplentes"'
    );
  });

  it('offers previous and next only where they lead somewhere', () => {
    const first = render(1, 55);
    const last = render(3, 55);

    expect(first).not.toContain('Página anterior');
    expect(first).toContain('Próxima página');
    expect(last).toContain('Página anterior');
    expect(last).not.toContain('Próxima página');
  });

  it('renders nothing when the list fits one page', () => {
    expect(render(1, 20)).toBe('');
    expect(render(1, 0)).toBe('');
  });

  it('shows a gap, hidden from assistive technology, in a long list', () => {
    const html = render(1, 20 * 50);

    expect(html).toContain('aria-hidden="true">…</span>');
    expect(html).toContain('aria-label="Página 50"');
    expect(html).not.toContain('aria-label="Página 25"');
  });
});
