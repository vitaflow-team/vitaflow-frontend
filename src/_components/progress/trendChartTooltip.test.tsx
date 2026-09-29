import { TREND_METRICS } from '@/_lib/trendMetrics';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TrendTooltip } from './trendChartTooltip';

const POINT = { t: Date.parse('2026-09-15T15:00:00-03:00'), value: 82.4 };

describe('refactor — TrendTooltip', () => {
  // UT-004
  it('shows the value with its unit and the point date', () => {
    const markup = renderToStaticMarkup(
      <TrendTooltip
        active
        payload={[{ payload: POINT }]}
        config={TREND_METRICS.weight}
      />
    );

    expect(markup).toContain('82,4 kg');
    expect(markup).toContain('15/09/2026');
    expect(markup).toContain('bg-primary text-primary-foreground');
  });

  // UT-004: BMI has no unit
  it('shows a bare BMI value', () => {
    const markup = renderToStaticMarkup(
      <TrendTooltip
        active
        payload={[{ payload: { ...POINT, value: 24.1 } }]}
        config={TREND_METRICS.bmi}
      />
    );

    expect(markup).toContain('>24,1<');
  });

  // UT-005
  it('renders nothing while inactive or without a point', () => {
    const config = TREND_METRICS.weight;

    expect(
      renderToStaticMarkup(
        <TrendTooltip
          active={false}
          payload={[{ payload: POINT }]}
          config={config}
        />
      )
    ).toBe('');
    expect(
      renderToStaticMarkup(<TrendTooltip active payload={[]} config={config} />)
    ).toBe('');
  });
});
