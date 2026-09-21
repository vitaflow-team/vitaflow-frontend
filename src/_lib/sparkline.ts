export interface SparklinePoint {
  x: number;
  y: number;
}

export interface Sparkline {
  width: number;
  height: number;
  points: SparklinePoint[];
  /** Atributo `d` pronto para um `<path>`. */
  path: string;
  /** Último ponto da série, para marcar onde o usuário está hoje. */
  last: SparklinePoint;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Geometria de uma linha de tendência decorativa: o maior valor fica no topo e
 * o menor na base. Menos de dois pontos não desenha tendência nenhuma, e uma
 * série constante vira uma reta no meio (em vez de uma divisão por zero).
 */
export function buildSparkline(
  values: number[],
  width: number,
  height: number
): Sparkline | null {
  if (values.length < 2 || !values.every(Number.isFinite)) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const step = width / (values.length - 1);

  const points = values.map((value, index) => ({
    x: round(index * step),
    y: round(
      range === 0 ? height / 2 : height - ((value - min) / range) * height
    ),
  }));

  return {
    width,
    height,
    points,
    path: points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
      .join(' '),
    last: points[points.length - 1],
  };
}
