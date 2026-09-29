import { niceTicks } from '@/_lib/chartAxis';
import { TREND_METRICS } from '@/_lib/trendMetrics';
import { Children, type ReactElement, type ReactNode } from 'react';
import { CartesianGrid, ReferenceArea, XAxis, YAxis } from 'recharts';
import { describe, expect, it } from 'vitest';
import { TrendChartAxes } from './trendChartAxes';

// Recharts draws nothing under `renderToStaticMarkup`, so the axes are checked
// through the elements they hand to the chart.
type Props = Record<string, unknown> & { children?: ReactNode };

function layers(element: ReactElement): ReactElement<Props>[] {
  return Children.toArray(
    (element.props as Props).children
  ) as ReactElement<Props>[];
}

const START = Date.parse('2026-08-01T00:00:00Z');
const END = Date.parse('2026-09-26T12:00:00Z');
const AXIS = niceTicks(60.9, 68.2);

function render(isBmi: boolean) {
  const config = isBmi ? TREND_METRICS.bmi : TREND_METRICS.weight;
  return layers(
    TrendChartAxes({
      startMs: START,
      endMs: END,
      axis: AXIS,
      config,
      isBmi,
    })
  );
}

describe('refactor — TrendChartAxes', () => {
  // UT-004
  it('draws the grid and a time axis over the whole window', () => {
    const [grid, xAxis] = render(false);

    expect(grid.type).toBe(CartesianGrid);
    expect(grid.props.vertical).toBe(false);
    expect(xAxis.type).toBe(XAxis);
    expect(xAxis.props.scale).toBe('time');
    expect(xAxis.props.domain).toEqual([START, END]);
    expect(xAxis.props.ticks).toHaveLength(5);
    const formatTick = xAxis.props.tickFormatter as (value: number) => string;
    expect(formatTick(END)).toBe('26/09');
  });

  // UT-004
  it('uses the round value ticks and the metric format on the value axis', () => {
    const [, , yAxis] = render(false);

    expect(yAxis.type).toBe(YAxis);
    expect(yAxis.props.ticks).toEqual(AXIS.ticks);
    expect(yAxis.props.domain).toEqual([AXIS.min, AXIS.max]);
    expect(yAxis.props.width).toBe(44);
    const formatTick = yAxis.props.tickFormatter as (value: number) => string;
    expect(formatTick(62.5)).toBe('62,5');
  });

  // UT-004 / UT-005
  it('adds the healthy band only on the BMI chart', () => {
    const weight = render(false);
    const bmi = render(true);

    expect(weight).toHaveLength(3);
    expect(bmi).toHaveLength(4);
    expect(bmi[3].type).toBe(ReferenceArea);
    expect(bmi[3].props).toMatchObject({
      y1: 18.5,
      y2: 24.9,
      ifOverflow: 'hidden',
    });
  });
});
