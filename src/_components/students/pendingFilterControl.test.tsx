import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PendingFilterControl } from './pendingFilterControl';

describe('pending filter control', () => {
  it('UT-128 toggles the "pendentes" query param and marks itself current', () => {
    const off = renderToStaticMarkup(<PendingFilterControl />);
    expect(off).toContain('href="/restrict/students?pendentes=1"');
    expect(off).not.toContain('aria-current');

    const on = renderToStaticMarkup(<PendingFilterControl pending />);
    expect(on).toContain('href="/restrict/students"');
    expect(on).toContain('aria-current="true"');
  });

  it('keeps the search and order when toggling', () => {
    const html = renderToStaticMarkup(
      <PendingFilterControl search="ana" order="name" />
    );
    expect(html).toContain('q=ana');
    expect(html).toContain('ordem=nome');
    expect(html).toContain('pendentes=1');
  });
});
