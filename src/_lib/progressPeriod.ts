export const PERIOD_OPTIONS = [4, 8, 12] as const;

export type Period = (typeof PERIOD_OPTIONS)[number];

export const DEFAULT_PERIOD: Period = 8;

/**
 * Lê o período da barra de endereços (`?semanas=`). Só `'4'`, `'8'` e `'12'`
 * são aceitos, exatamente assim: vazio, decimal, texto, zero à esquerda ou o
 * parâmetro repetido caem no padrão de 8 semanas em silêncio, sem lançar erro
 * (ADR-001: o usuário nunca vê um erro por causa do endereço).
 */
export function parsePeriod(value: string | string[] | undefined): Period {
  if (typeof value !== 'string') {
    return DEFAULT_PERIOD;
  }

  return (
    PERIOD_OPTIONS.find(option => String(option) === value) ?? DEFAULT_PERIOD
  );
}
