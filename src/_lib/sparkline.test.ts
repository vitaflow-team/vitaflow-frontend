import { describe, expect, it } from 'vitest';
import { buildSparkline } from './sparkline';

describe('restricted home sparkline — buildSparkline', () => {
  it('UT-038 spreads the points and puts the highest weight at the top', () => {
    const sparkline = buildSparkline([66.2, 64.4, 62.6], 100, 40);

    expect(sparkline).not.toBeNull();
    expect(sparkline!.points.map(point => point.x)).toEqual([0, 50, 100]);

    const ys = sparkline!.points.map(point => point.y);
    expect(ys[0]).toBeLessThan(ys[1]);
    expect(ys[1]).toBeLessThan(ys[2]);
    expect(sparkline!.last).toEqual(sparkline!.points[2]);
  });

  it('UT-039 draws no trend line with fewer than two points', () => {
    expect(buildSparkline([62.9], 100, 40)).toBeNull();
    expect(buildSparkline([], 100, 40)).toBeNull();
  });

  it('UT-040 draws a flat line for a constant series', () => {
    const sparkline = buildSparkline([62, 62, 62], 100, 40);

    expect(sparkline).not.toBeNull();
    const ys = sparkline!.points.map(point => point.y);
    expect(new Set(ys).size).toBe(1);
    expect(Number.isFinite(ys[0])).toBe(true);
    expect(sparkline!.path).not.toContain('NaN');
  });
});
