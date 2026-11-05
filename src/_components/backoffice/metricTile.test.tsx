import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MetricTile } from './metricTile';

describe('MetricTile (task_02)', () => {
  // UT-021
  it('renders the label, value, and trend delta when given all three', () => {
    const html = renderToStaticMarkup(
      <MetricTile
        label="MRR atual"
        value="R$ 12.345,00"
        trend={{ label: '+5,2% vs mês anterior', tone: 'positive' }}
      />
    );

    expect(html).toContain('MRR atual');
    expect(html).toContain('R$ 12.345,00');
    expect(html).toContain('+5,2% vs mês anterior');
  });

  // UT-022
  it('renders the label and value without a trend figure, never a false "0%", when no trend is given', () => {
    const html = renderToStaticMarkup(
      <MetricTile label="Usuário · Free" value="42" />
    );

    expect(html).toContain('Usuário · Free');
    expect(html).toContain('42');
    expect(html).not.toContain('%');
    expect(html).not.toContain('0%');
  });

  it('renders the "unavailable" tone distinctly, never as a real zero-percent change', () => {
    const html = renderToStaticMarkup(
      <MetricTile
        label="MRR atual"
        value="R$ 12.345,00"
        trend={{ label: 'Comparação indisponível', tone: 'unavailable' }}
      />
    );

    expect(html).toContain('Comparação indisponível');
    expect(html).not.toContain('0%');
    expect(html).not.toContain('+0');
  });
});
