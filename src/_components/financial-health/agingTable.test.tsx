import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AgingTable } from './agingTable';

const OVERDUE = {
  totalCents: 70000,
  delinquentCount: 2,
  bands: { d1to7Cents: 30000, d8to30Cents: 40000, d31PlusCents: 0 },
};

describe('AgingTable', () => {
  it('lists each band with its amount and closes with the total', () => {
    const html = renderToStaticMarkup(<AgingTable overdue={OVERDUE} />);

    expect(html).toContain('>1–7 dias</th>');
    expect(html).toContain('>8–30 dias</th>');
    expect(html).toContain('>31+ dias</th>');
    expect(html).toContain('R$ 300,00');
    expect(html).toContain('R$ 400,00');
    expect(html).toContain('R$ 0,00');
    expect(html).toContain('Total em atraso');
    expect(html).toContain('R$ 700,00');
  });

  it('is a captioned table with column and row headers', () => {
    const html = renderToStaticMarkup(<AgingTable overdue={OVERDUE} />);

    expect(html).toContain('<caption class="sr-only">');
    expect(html.match(/scope="col"/g)).toHaveLength(2);
    expect(html.match(/scope="row"/g)).toHaveLength(4);
  });
});
