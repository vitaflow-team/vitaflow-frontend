import { TREND_METRICS } from '@/_lib/trendMetrics';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  TrendChartBandLabel,
  TrendChartEmptyState,
  TrendChartTable,
} from './trendChartDetails';

const POINTS = [
  { t: Date.parse('2026-09-01T12:00:00Z'), value: 83 },
  { t: Date.parse('2026-09-15T12:00:00Z'), value: 82.4 },
];

describe('refactor — TrendChart details', () => {
  // UT-004
  it('labels the healthy BMI band with its limits', () => {
    const markup = renderToStaticMarkup(<TrendChartBandLabel />);

    expect(markup).toContain('Peso normal · 18,5 – 24,9');
    expect(markup).toContain('background-color:var(--sage-bg)');
  });

  // UT-005
  it('suggests a longer period only below 12 weeks', () => {
    const short = renderToStaticMarkup(
      <TrendChartEmptyState
        summary="Peso: sem registros em 4 semanas."
        weeks={4}
      />
    );
    const longest = renderToStaticMarkup(
      <TrendChartEmptyState
        summary="Peso: sem registros em 12 semanas."
        weeks={12}
      />
    );

    expect(short).toContain('Peso: sem registros em 4 semanas.');
    expect(short).toContain('Escolha um período maior');
    expect(longest).toContain('Peso: sem registros em 12 semanas.');
    expect(longest).not.toContain('Escolha um período maior');
  });

  // UT-004
  it('lists every point in the hidden table', () => {
    const markup = renderToStaticMarkup(
      <TrendChartTable
        title="Peso"
        weeks={8}
        config={TREND_METRICS.weight}
        chartPoints={POINTS}
      />
    );

    expect(markup).toContain('class="sr-only"');
    expect(markup).toContain('Peso — registros das últimas 8 semanas');
    expect(markup.match(/<tr>/g)).toHaveLength(3);
    expect(markup).toContain('<td>83 kg</td>');
    expect(markup).toContain('<td>82,4 kg</td>');
  });
});
