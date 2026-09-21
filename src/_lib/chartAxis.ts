export interface NiceTicks {
  ticks: number[];
  min: number;
  max: number;
}

/** Passos "redondos" aceitos para o eixo vertical, multiplicados por 10^n. */
const STEP_MULTIPLES = [1, 2, 2.5, 5] as const;

const MIN_TICKS = 4;
const MAX_TICKS = 6;

/** Tolerância para que 0.5 / 0.1 = 4.999999999999999 não vire uma marca extra. */
const EPSILON = 1e-9;

/** Remove o lixo de ponto flutuante de somas como 0.1 + 0.2. */
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
 * Marcas redondas para o eixo vertical: escolhe um passo de {1, 2, 2,5, 5} × 10ⁿ
 * que produza cerca de `count` marcas (nunca menos de quatro nem mais de seis)
 * envolvendo os dados. Valores iguais recebem uma abertura mínima (`minSpread`)
 * para que a linha reta caia no meio de um eixo válido (ADR-002).
 *
 * Para o IMC quem chama passa `min = Math.min(dataMin, 18.5)` e
 * `max = Math.max(dataMax, 24.9)`, de modo que a faixa saudável fique sempre
 * dentro do eixo.
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
      // Fora de 4–6 marcas a opção só serve como rede de segurança.
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
 * Marcas do eixo de tempo: `count` instantes igualmente espaçados cobrindo toda
 * a janela selecionada, sempre incluindo as duas pontas. Uma janela degenerada
 * (início igual ou posterior ao fim) rende uma única marca.
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
