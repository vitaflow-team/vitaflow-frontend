import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { panelCopy } from '@/_lib/financialPanelCopy';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';
import { DelinquentList } from './delinquentList';

const ITEMS = [
  {
    clientId: 'c1',
    name: 'Ana Souza',
    totalOwedCents: 45000,
    overdueCount: 2,
    oldestDaysOverdue: 12,
  },
  {
    clientId: 'c2',
    name: 'Bruno Lima',
    totalOwedCents: 20000,
    overdueCount: 1,
    oldestDaysOverdue: 1,
  },
];

function render(
  items = ITEMS,
  profile: FinancialPanelProfile = 'PHYSICAL_EDUCATOR'
) {
  return renderToStaticMarkup(
    <DelinquentList items={items} profile={profile} copy={panelCopy(profile)} />
  );
}

describe('DelinquentList', () => {
  it('UT-133 renders one row per item with the name as a single link to the billing area', () => {
    const html = render();

    expect(html.match(/<li/g)).toHaveLength(2);
    expect(html.match(/<a /g)).toHaveLength(2);
    expect(html).toContain('href="/restrict/students/c1/billing"');
    expect(html).toContain('href="/restrict/students/c2/billing"');
    expect(html).toContain('>Ana Souza</a>');
  });

  it('UT-133 shows total owed, overdue count and days overdue of the oldest, each with a label', () => {
    const html = render();

    expect(html).toContain('R$\u00a0450,00');
    expect(html).toContain('>12 dias<');
    expect(html).toContain('>1 dia<');
    expect(html).toContain('>Total devido</dt>');
    expect(html).toContain('>Cobranças em atraso</dt>');
    expect(html).toContain('>Atraso mais antigo</dt>');
  });

  it('leads a nutritionist row to the patient billing tab and a gym row to the student', () => {
    expect(render(ITEMS, 'NUTRITIONIST')).toContain(
      'href="/restrict/patients/c1/cobranca"'
    );
    const gym = render(ITEMS, 'ACADEMIA');
    expect(gym).toContain('href="/restrict/academia-alunos/c1"');
    expect(gym).toContain('Mensalidades em atraso');
  });

  it('UT-148 renders the positive empty message and no table or list when there are no items', () => {
    const html = render([]);

    expect(html).toContain('Nenhum aluno inadimplente. Está tudo em dia.');
    expect(html).not.toContain('<table');
    expect(html).not.toContain('<li');
    expect(html).not.toContain('<a ');
  });

  it('UT-149 truncates a 200-character name, keeps the full name in title and the amount visible', () => {
    const name = 'N'.repeat(200);
    const html = render([{ ...ITEMS[0], name }]);

    expect(html).toContain(`title="${name}"`);
    expect(html).toContain('truncate');
    expect(html).toContain('min-w-0');
    expect(html).toContain('R$\u00a0450,00');
  });

  it('wraps the figures instead of letting a large amount overflow the row', () => {
    const html = render([{ ...ITEMS[0], totalOwedCents: 123456789012 }]);

    expect(html).toContain('R$\u00a01.234.567.890,12');
    expect(html).toContain('flex-wrap');
    expect(html).toContain('break-words');
  });
});
