import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformDelinquentRow } from './platformDelinquentRow';

const ROW = {
  userId: 'u1',
  name: 'Ana Souza',
  accountType: 'NUTRITIONIST' as const,
  planName: 'Profissional Premium',
  totalOwedCents: 9990,
  oldestDaysOverdue: 12,
};

function render(row = ROW) {
  return renderToStaticMarkup(
    <ul>
      <PlatformDelinquentRow row={row} />
    </ul>
  );
}

describe('PlatformDelinquentRow — financial-health US-023', () => {
  it('shows name, account type, plan, amount owed and days overdue of the oldest', () => {
    const html = render();

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Nutricionista');
    expect(html).toContain('Profissional Premium');
    expect(html).toMatch(/R\$\s99,90/);
    expect(html).toContain('12 dias');
  });

  it('links the name, once, to the account directory entry searched by that name', () => {
    const html = render({ ...ROW, name: 'Ana & Souza' });

    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain(
      'href="/restrict/backoffice/accounts?busca=Ana%20%26%20Souza"'
    );
  });

  it('shows no invoice-level detail', () => {
    const html = render();

    expect(html).not.toContain('Cobranças em atraso');
    expect(html).not.toContain('Vencimento');
  });

  it('truncates a very long name and keeps the full one in the title; the amount stays visible (US-027.EC-1)', () => {
    const name = 'N'.repeat(200);
    const html = render({ ...ROW, name });

    expect(html).toContain('truncate');
    expect(html).toContain(`title="${name}"`);
    expect(html).toMatch(/R\$\s99,90/);
  });
});
