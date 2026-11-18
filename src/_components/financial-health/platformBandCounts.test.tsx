import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformBandCounts } from './platformBandCounts';

describe('PlatformBandCounts — financial-health US-024', () => {
  const html = renderToStaticMarkup(
    <PlatformBandCounts counts={{ d1to7: 4, d8to30: 2, d31Plus: 1 }} />
  );

  it('shows the three bands with their delinquent counts and the total', () => {
    expect(html).toContain('1–7 dias');
    expect(html).toContain('8–30 dias');
    expect(html).toContain('31+ dias');
    expect(html).toMatch(/<td[^>]*>4<\/td>/);
    expect(html).toMatch(/<td[^>]*>2<\/td>/);
    expect(html).toMatch(/<td[^>]*>1<\/td>/);
    expect(html).toMatch(/<td[^>]*>7<\/td>/);
  });

  it('is an accessible table with a caption and column and row headers', () => {
    expect(html).toContain('<caption');
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
  });

  it('carries counts only: no currency amount', () => {
    expect(html).not.toContain('R$');
  });
});
