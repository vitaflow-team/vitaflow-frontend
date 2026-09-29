import { TREND_METRICS } from '@/_lib/trendMetrics';
import { Children, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Area, ReferenceDot } from 'recharts';
import { describe, expect, it } from 'vitest';
import { TrendChartGradient, TrendChartSeries } from './trendChartSeries';

type Props = Record<string, unknown> & { children?: ReactNode };

function layers(element: ReactElement): ReactElement<Props>[] {
  return Children.toArray(
    (element.props as Props).children
  ) as ReactElement<Props>[];
}

const POINTS = [
  { t: 1, value: 83 },
  { t: 2, value: 82.4 },
];

describe('refactor — TrendChartGradient', () => {
  // UT-004
  it('fades the metric color from 30% to transparent', () => {
    const markup = renderToStaticMarkup(
      <svg>
        <TrendChartGradient id="fill" color="var(--icon-accent)" />
      </svg>
    );

    expect(markup).toContain(
      '<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">'
    );
    expect(markup).toContain(
      'offset="0%" stop-color="var(--icon-accent)" stop-opacity="0.3"'
    );
    expect(markup).toContain(
      'offset="100%" stop-color="var(--icon-accent)" stop-opacity="0"'
    );
  });
});

describe('refactor — TrendChartSeries', () => {
  // UT-004
  it('draws the area and highlights the last point', () => {
    const [area, lastDot] = layers(
      TrendChartSeries({
        chartPoints: POINTS,
        config: TREND_METRICS.weight,
        gradientId: 'fill',
      })
    );

    expect(area.type).toBe(Area);
    expect(area.props).toMatchObject({
      dataKey: 'value',
      stroke: 'var(--icon-accent)',
      strokeWidth: 2.5,
      fill: 'url(#fill)',
      fillOpacity: 1,
      isAnimationActive: false,
    });
    expect(lastDot.type).toBe(ReferenceDot);
    expect(lastDot.props).toMatchObject({ x: 2, y: 82.4, r: 5.5 });
  });

  // UT-005
  it('shows only the dot for a single point', () => {
    const [area, lastDot] = layers(
      TrendChartSeries({
        chartPoints: [POINTS[0]],
        config: TREND_METRICS.bmi,
        gradientId: 'fill',
      })
    );

    expect(area.props).toMatchObject({ strokeWidth: 0, fillOpacity: 0 });
    expect(lastDot.props).toMatchObject({
      x: 1,
      y: 83,
      fill: 'var(--chart-3)',
    });
  });
});
