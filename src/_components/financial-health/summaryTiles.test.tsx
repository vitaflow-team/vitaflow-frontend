import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SummaryTiles } from './summaryTiles';

const CURRENT = {
  expectedCents: 123456,
  receivedCents: 50000,
  stillOwedCents: 73456,
};

function render(changes: {
  expected: number | null;
  received: number | null;
  stillOwed: number | null;
}) {
  return renderToStaticMarkup(
    <SummaryTiles
      monthLabel="Março de 2026"
      current={CURRENT}
      changes={changes}
    />
  );
}

describe('SummaryTiles', () => {
  it('UT-134 shows "Sem comparação" and no percentage when the change is null', () => {
    const html = render({ expected: null, received: null, stillOwed: null });

    expect(html.match(/Sem comparação/g)).toHaveLength(3);
    expect(html).not.toContain('%');
  });

  it('UT-134 shows the signed percentage when there is a change', () => {
    const html = render({ expected: 20, received: -5, stillOwed: 0 });

    expect(html).toContain('+20%');
    expect(html).toContain('-5%');
    expect(html).toContain('0% em relação ao mês anterior');
    expect(html).not.toContain('Sem comparação');
  });

  it('shows the three figures in BRL with the month in the heading', () => {
    const html = render({ expected: null, received: null, stillOwed: null });

    expect(html).toContain('Resumo de Março de 2026');
    expect(html).toContain('R$\u00a01.234,56');
    expect(html).toContain('R$\u00a0500,00');
    expect(html).toContain('R$\u00a0734,56');
  });

  it('UT-139 associates every tile label with its value through aria-labelledby', () => {
    const html = render({ expected: 1, received: 2, stillOwed: 3 });

    for (const id of ['expected', 'received', 'still-owed']) {
      const labelId = `financial-${id}-label`;
      expect(html).toContain(`aria-labelledby="${labelId}"`);
      expect(html).toContain(`id="${labelId}"`);
    }
    for (const label of ['Previsto', 'Recebido', 'Falta receber']) {
      expect(html).toContain(`>${label}</span>`);
    }
  });

  it('UT-139 explains the basis of each figure in words', () => {
    const html = render({ expected: null, received: null, stillOwed: null });

    expect(html).toContain('pela data do pagamento');
    expect(html).toContain('vencimento neste mês');
  });
});
