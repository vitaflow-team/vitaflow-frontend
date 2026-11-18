import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SummaryTile } from './summaryTile';

function render(change: number | null) {
  return renderToStaticMarkup(
    <SummaryTile
      id="financial-expected"
      label="Previsto"
      hint="Cobranças com vencimento neste mês."
      value="R$ 10,00"
      change={change}
    />
  );
}

describe('SummaryTile', () => {
  it('names the group by its label and keeps the value inside it', () => {
    const html = render(null);

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-labelledby="financial-expected-label"');
    expect(html).toContain('id="financial-expected-label"');
    expect(html).toContain('R$ 10,00');
  });

  it('puts the sign and the comparison base in words', () => {
    expect(render(20)).toContain('+20% em relação ao mês anterior');
    expect(render(-3)).toContain('-3% em relação ao mês anterior');
  });

  it('says there is no comparison, without any percentage, when there is no base', () => {
    const html = render(null);

    expect(html).toContain('Sem comparação');
    expect(html).not.toContain('%');
  });
});
