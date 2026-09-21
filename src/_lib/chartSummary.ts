export interface TrendSummaryPoint {
  t: number;
  value: number;
}

export interface TrendSummaryInput {
  /** Nome da métrica como aparece na frase, por exemplo `Peso`. */
  label: string;
  /** Unidade já no formato exibido, por exemplo `kg`. Vazia para o IMC. */
  unit: string;
  weeks: number;
  points: TrendSummaryPoint[];
  format: (value: number) => string;
}

/** Sinal de menos de verdade (U+2212), não o hífen do teclado. */
const MINUS_SIGN = '−';

function withUnit(text: string, unit: string): string {
  return unit ? `${text} ${unit}` : text;
}

/**
 * Frase neutra que descreve a série para quem não vê o gráfico (ADR-003):
 * primeiro valor, último valor, variação com sinal e o período. Nunca julga a
 * tendência — sem "melhora", "piora", "bom" ou "ruim".
 */
export function buildTrendSummary(input: TrendSummaryInput): string {
  const { label, unit, weeks, points, format } = input;
  const period = `${weeks} semanas`;

  if (points.length === 0) {
    return `${label}: sem registros em ${period}.`;
  }

  if (points.length === 1) {
    return `${label}: um registro em ${period}, ${withUnit(
      format(points[0].value),
      unit
    )}.`;
  }

  const first = points[0].value;
  const last = points[points.length - 1].value;
  const from = withUnit(format(first), unit);
  const to = withUnit(format(last), unit);
  const opening = `${label} de ${from} para ${to} em ${period}`;

  const change = Math.round((last - first) * 10) / 10;
  if (change === 0) {
    return `${opening}, sem variação`;
  }

  const sign = change > 0 ? '+' : MINUS_SIGN;
  const magnitude = withUnit(format(Math.abs(change)), unit);
  return `${opening}, variação de ${sign}${magnitude}`;
}
