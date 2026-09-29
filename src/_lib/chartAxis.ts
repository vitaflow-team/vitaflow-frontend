export interface NiceTicks {
  ticks: number[];
  min: number;
  max: number;
}

/** "Round" steps accepted for the vertical axis, multiplied by 10^n. */
const STEP_MULTIPLES = [1, 2, 2.5, 5] as const;

/** WHO "Peso normal" BMI range, drawn as a band on the BMI chart. */
export const HEALTHY_BMI_MIN = 18.5;
export const HEALTHY_BMI_MAX = 24.9;

const MIN_TICKS = 4;
const MAX_TICKS = 6;

/** Tolerance so that 0.5 / 0.1 = 4.999999999999999 does not become an extra tick. */
const EPSILON = 1e-9;

/** Strips the floating-point noise of sums such as 0.1 + 0.2. */
function clean(value: number): number {
  return Number(value.toFixed(10));
}

function buildTicks(min: number, max: number, step: number): number[] {
  const firstIndex = Math.floor(min / step + EPSILON);
  const lastIndex = Math.ceil(max / step - EPSILON);
  const ticks: number[] = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    ticks.push(clean(index * step));
  }

  return ticks;
}

/**
 * Round ticks for the vertical axis: picks a step of {1, 2, 2.5, 5} × 10ⁿ that
 * yields about `count` ticks (never fewer than four nor more than six) around
 * the data. Equal values get a minimum spread (`minSpread`) so the flat line
 * sits in the middle of a valid axis (ADR-002).
 *
 * For BMI, `getValueAxis` passes `min = Math.min(dataMin, 18.5)` and
 * `max = Math.max(dataMax, 24.9)`, so the healthy band always stays inside
 * the axis.
 */
export function niceTicks(
  min: number,
  max: number,
  count = 5,
  minSpread = 1
): NiceTicks {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;

  let lower = Math.min(safeMin, safeMax);
  let upper = Math.max(safeMin, safeMax);

  if (upper - lower <= 0) {
    const half = Math.abs(minSpread) / 2 || 0.5;
    const center = lower;
    lower = center - half;
    upper = center + half;
  }

  const targetCount = Math.max(2, Math.round(count));
  const rawStep = (upper - lower) / (targetCount - 1);
  const baseExponent = Math.floor(Math.log10(rawStep));

  let best: { ticks: number[]; step: number } | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (
    let exponent = baseExponent - 2;
    exponent <= baseExponent + 2;
    exponent += 1
  ) {
    for (const multiple of STEP_MULTIPLES) {
      const step = clean(multiple * 10 ** exponent);
      if (step <= 0) continue;

      const ticks = buildTicks(lower, upper, step);
      if (ticks.length < 2) continue;

      const withinBounds =
        ticks.length >= MIN_TICKS && ticks.length <= MAX_TICKS;
      // Outside 4–6 ticks an option only serves as a safety net.
      const score =
        Math.abs(ticks.length - targetCount) + (withinBounds ? 0 : 100);

      if (score < bestScore) {
        bestScore = score;
        best = { ticks, step };
      }
    }
  }

  const ticks = best?.ticks ?? [clean(lower), clean(upper)];

  return {
    ticks,
    min: ticks[0],
    max: ticks[ticks.length - 1],
  };
}

/**
 * Time axis ticks: `count` evenly spaced instants covering the whole selected
 * window, always including both ends. A degenerate window (start equal to or
 * after the end) yields a single tick.
 */
export function getTimeTicks(
  startMs: number,
  endMs: number,
  count = 5
): number[] {
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return [];
  }

  if (endMs <= startMs || count <= 1) {
    return [startMs];
  }

  const total = Math.round(count);
  const ticks: number[] = [];

  for (let index = 0; index < total; index += 1) {
    ticks.push(Math.round(startMs + ((endMs - startMs) * index) / (total - 1)));
  }

  ticks[total - 1] = endMs;
  return ticks;
}

/**
 * Vertical axis for a series. The BMI axis always includes the healthy band,
 * even when every value falls outside it.
 */
export function getValueAxis(
  values: number[],
  includeHealthyBand: boolean
): NiceTicks {
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  if (!includeHealthyBand) return niceTicks(dataMin, dataMax);

  return niceTicks(
    Math.min(dataMin, HEALTHY_BMI_MIN),
    Math.max(dataMax, HEALTHY_BMI_MAX)
  );
}
