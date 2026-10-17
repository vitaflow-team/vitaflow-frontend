import type { Bmi } from '@/_types/clinicalRecords';

const CLASSIFICATION_LABELS: Record<Bmi['classification'], string> = {
  ABAIXO_DO_PESO: 'Abaixo do peso',
  PESO_NORMAL: 'Peso normal',
  SOBREPESO: 'Sobrepeso',
  OBESIDADE_GRAU_I: 'Obesidade grau I',
  OBESIDADE_GRAU_II: 'Obesidade grau II',
  OBESIDADE_GRAU_III: 'Obesidade grau III',
};

/** IMC and its classification, shown only when the backend derived one. */
export function BmiBadge({ bmi }: { bmi: Bmi | null }) {
  if (!bmi) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs font-medium">
      IMC {bmi.value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ·{' '}
      {CLASSIFICATION_LABELS[bmi.classification]}
    </span>
  );
}
