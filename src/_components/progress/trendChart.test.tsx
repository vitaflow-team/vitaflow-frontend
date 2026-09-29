import type { TrendPoint } from '@/_types/progress';
import { Children, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AreaChart, Tooltip } from 'recharts';
import { describe, expect, it } from 'vitest';
import { niceTicks } from '@/_lib/chartAxis';
import { TREND_METRICS } from '@/_lib/trendMetrics';
import { TrendChart, TrendChartDrawing } from './trendChart';
import { TrendChartAxes } from './trendChartAxes';
import { TrendChartGradient, TrendChartSeries } from './trendChartSeries';

type Props = Record<string, unknown> & { children?: ReactNode };

function layers(element: ReactElement): ReactElement<Props>[] {
  return Children.toArray(
    (element.props as Props).children
  ) as ReactElement<Props>[];
}

const PERIOD = {
  weeks: 8,
  start: '2026-08-01T00:00:00.000Z',
  end: '2026-09-26T00:00:00.000Z',
};

const WEIGHTS: TrendPoint[] = [
  { recordedAt: '2026-09-15T12:00:00.000Z', value: 82.4 },
  { recordedAt: '2026-09-01T12:00:00.000Z', value: 83 },
  { recordedAt: 'not a date', value: 90 },
];

describe('refactor — composed TrendChart', () => {
  // UT-004
  it('wraps the drawing in an image role described by the summary', () => {
    const markup = renderToStaticMarkup(
      <TrendChart
        title="Peso"
        points={WEIGHTS}
        period={PERIOD}
        metric="weight"
      />
    );

    expect(markup).toContain(
      'role="img" aria-label="Peso de 83 kg para 82,4 kg em 8 semanas, variação de −0,6 kg"'
    );
    expect(markup).toContain('Peso — registros das últimas 8 semanas');
    // The unparseable date never reaches the table.
    expect(markup).not.toContain('90 kg');
    expect(markup).not.toContain('Peso normal');
  });

  // UT-004
  it('shows the healthy band label on a BMI chart with points', () => {
    const markup = renderToStaticMarkup(
      <TrendChart
        title="IMC"
        points={[{ recordedAt: '2026-09-15T12:00:00.000Z', value: 29.2 }]}
        period={PERIOD}
        metric="bmi"
      />
    );

    expect(markup).toContain('Peso normal · 18,5 – 24,9');
  });

  // UT-005
  it('replaces the drawing and table with the summary when empty', () => {
    const markup = renderToStaticMarkup(
      <TrendChart title="IMC" points={[]} period={PERIOD} metric="bmi" />
    );

    expect(markup).toContain('IMC: sem registros em 8 semanas.');
    expect(markup).toContain('Escolha um período maior');
    expect(markup).not.toContain('role="img"');
    expect(markup).not.toContain('<table');
    expect(markup).not.toContain('Peso normal');
  });
});

describe('refactor — TrendChartDrawing', () => {
  // UT-004: layer order and shared data match the pre-split drawing.
  it('stacks gradient, axes, tooltip and series over the same points', () => {
    const points = [
      { t: 1, value: 20 },
      { t: 2, value: 21 },
    ];
    const container = TrendChartDrawing({
      chartPoints: points,
      config: TREND_METRICS.bmi,
      gradientId: 'fill',
      isBmi: true,
      startMs: 0,
      endMs: 3,
    });
    const [chart] = layers(container);
    const [gradient, axes, tooltip, series] = layers(chart);

    expect(chart.type).toBe(AreaChart);
    expect(chart.props.data).toBe(points);
    expect(gradient.type).toBe(TrendChartGradient);
    expect(axes.type).toBe(TrendChartAxes);
    expect(axes.props.isBmi).toBe(true);
    // The BMI axis stretches to hold the whole healthy band.
    expect(axes.props.axis).toEqual(niceTicks(18.5, 24.9));
    expect(tooltip.type).toBe(Tooltip);
    expect(series.type).toBe(TrendChartSeries);
    expect(series.props.gradientId).toBe('fill');
  });
});
