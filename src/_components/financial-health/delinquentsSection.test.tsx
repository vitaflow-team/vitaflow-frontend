import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { panelCopy } from '@/_lib/financialPanelCopy';
import type { DelinquentsPage } from '@/_types/delinquentsPage';
import type { LoadFailure } from '@/_types/loadFailure';
import { DelinquentsSection } from './delinquentsSection';

const PAGE: DelinquentsPage = {
  items: [
    {
      clientId: 'c1',
      name: 'Ana Souza',
      totalOwedCents: 45000,
      overdueCount: 2,
      oldestDaysOverdue: 12,
    },
  ],
  page: 1,
  pageSize: 20,
  total: 45,
};

function render(delinquents: DelinquentsPage | LoadFailure) {
  return renderToStaticMarkup(
    <DelinquentsSection
      delinquents={delinquents}
      profile="PHYSICAL_EDUCATOR"
      copy={panelCopy('PHYSICAL_EDUCATOR')}
      path="/restrict/financeiro"
      query={{ month: '2026-03', page: 1 }}
    />
  );
}

describe('DelinquentsSection', () => {
  it('has a labelled heading, a definition and the anchor paging lands on', () => {
    const html = render(PAGE);

    expect(html).toContain('id="inadimplentes"');
    expect(html).toContain('aria-labelledby="financial-delinquents-heading"');
    expect(html).toContain('>Inadimplentes</h2>');
    expect(html).toContain(
      'Lista de alunos com ao menos uma cobrança em atraso'
    );
    expect(html).toContain('Ana Souza');
    expect(html).toContain('Paginação da lista de inadimplentes');
  });

  it('keeps a failure of the list inside the section, with a retry', () => {
    const html = render('failed');

    expect(html).toContain(
      'Não foi possível carregar a lista de inadimplentes.'
    );
    expect(html).toContain('href="/restrict/financeiro?month=2026-03"');
    expect(html).not.toContain('<li');
  });
});
