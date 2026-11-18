import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PaginationLink } from './paginationLink';

describe('PaginationLink', () => {
  it('is a real link, so the keyboard reaches it', () => {
    const html = renderToStaticMarkup(
      <PaginationLink href="/restrict/financeiro?page=2" label="2" />
    );

    expect(html).toContain('<a ');
    expect(html).toContain('href="/restrict/financeiro?page=2"');
    expect(html).not.toContain('aria-current');
  });

  it('marks the current page for assistive technology, not only by style', () => {
    const html = renderToStaticMarkup(
      <PaginationLink href="/x" label="2" ariaLabel="Página 2" current />
    );

    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Página 2"');
  });
});
