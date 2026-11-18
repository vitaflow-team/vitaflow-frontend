import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AgingBands } from './agingBands';

const OVERDUE = {
  totalCents: 70000,
  delinquentCount: 2,
  bands: { d1to7Cents: 30000, d8to30Cents: 40000, d31PlusCents: 0 },
};

const MESSAGE = 'Nenhuma cobrança em atraso. Está tudo em dia.';

function render(overdue = OVERDUE) {
  return renderToStaticMarkup(
    <AgingBands overdue={overdue} noOverdueMessage={MESSAGE} />
  );
}

describe('AgingBands', () => {
  it('UT-132 renders the three labelled bands with BRL amounts and the total', () => {
    const html = render();

    expect(html).toContain('1–7 dias');
    expect(html).toContain('8–30 dias');
    expect(html).toContain('31+ dias');
    expect(html).toContain('R$\u00a0300,00');
    expect(html).toContain('R$\u00a0400,00');
    expect(html).toContain('Total em atraso');
    expect(html).toContain('R$\u00a0700,00');
    expect(html).toContain('Inadimplentes: 2');
  });

  it('UT-132 renders zero amounts as R$ 0,00 with the positive message', () => {
    const html = render({
      totalCents: 0,
      delinquentCount: 0,
      bands: { d1to7Cents: 0, d8to30Cents: 0, d31PlusCents: 0 },
    });

    expect(html.match(/R\$\u00a00,00/g)).toHaveLength(4);
    expect(html).toContain(MESSAGE);
    expect(html).not.toContain('Inadimplentes:');
  });

  it('UT-139 renders the bands as a table with column and row headers', () => {
    const html = render();

    expect(html).toContain('<table');
    expect(html).toContain('<caption');
    expect(html.match(/scope="col"/g)).toHaveLength(2);
    expect(html.match(/scope="row"/g)).toHaveLength(4);
  });

  it('says the section is the current situation, whatever month is chosen', () => {
    const html = render();

    expect(html).toContain('Situação atual');
    expect(html).toContain('vencimento antes de hoje');
  });
});
