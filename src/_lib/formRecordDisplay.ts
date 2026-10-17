/** `YYYY-MM-DDTHH:mm:ssZ` to `dd/mm/aaaa`, in the viewer's own time zone. */
export function formatRecordedAt(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleDateString('pt-BR');
}

/** A field's raw answer as display text; booleans read as Sim/Não. */
export function formatFieldValue(
  value: string | number | boolean | null
): string {
  if (value === null) return '—';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  return String(value);
}
