const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCentsAsCurrency(cents: number): string {
  return brlFormatter.format(cents / 100);
}

/** Accepts `,` or `.` as the decimal separator; whitespace is trimmed first. */
export function normalizeAmountInput(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (!/^\d+([.,]\d{1,2})?$/.test(trimmed)) return undefined;
  return trimmed.replace(',', '.');
}

/** Whole cents from a normalized (dot-decimal) amount string. */
export function amountToCents(normalized: string): number {
  return Math.round(Number(normalized) * 100);
}
