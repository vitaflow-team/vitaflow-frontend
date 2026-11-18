import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformAccountCard } from './platformAccountCard';

describe('PlatformAccountCard', () => {
  it('shows the month figures and today overdue of one account type', () => {
    const html = renderToStaticMarkup(
      <ul>
        <PlatformAccountCard
          label="Educador físico"
          totals={{
            expectedCents: 9990,
            receivedCents: 5000,
            stillOwedCents: 4990,
          }}
          overdue={{
            totalCents: 2000,
            delinquentCount: 3,
            bands: { d1to7Cents: 2000, d8to30Cents: 0, d31PlusCents: 0 },
          }}
        />
      </ul>
    );

    expect(html).toContain('Educador físico');
    expect(html).toMatch(/Previsto.*R\$\s99,90/);
    expect(html).toMatch(/Recebido.*R\$\s50,00/);
    expect(html).toMatch(/Falta receber.*R\$\s49,90/);
    expect(html).toMatch(/Em atraso hoje.*R\$\s20,00/);
    expect(html).toMatch(/Inadimplentes.*3/);
  });
});
