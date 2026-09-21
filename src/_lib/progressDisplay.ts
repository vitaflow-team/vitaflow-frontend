import type { BmiClassification } from './bmi';

export interface BmiBadgeDisplay {
  label: string;
  foregroundToken: string;
  backgroundToken: string;
}

export type BmiStripTone = 'sage-bg' | 'info-bg' | 'warn-bg' | 'muted';

const BMI_STRIP_TONE: Record<BmiClassification, BmiStripTone> = {
  ABAIXO_DO_PESO: 'info-bg',
  PESO_NORMAL: 'sage-bg',
  SOBREPESO: 'warn-bg',
  OBESIDADE_GRAU_I: 'muted',
  OBESIDADE_GRAU_II: 'muted',
  OBESIDADE_GRAU_III: 'muted',
};

const BMI_BADGE_DISPLAY: Record<BmiClassification, BmiBadgeDisplay> = {
  ABAIXO_DO_PESO: {
    label: 'Abaixo do peso',
    foregroundToken: 'var(--info)',
    backgroundToken: 'var(--info-bg)',
  },
  PESO_NORMAL: {
    label: 'Peso normal',
    foregroundToken: 'var(--sage)',
    backgroundToken: 'var(--sage-bg)',
  },
  SOBREPESO: {
    label: 'Sobrepeso',
    foregroundToken: 'var(--warn)',
    backgroundToken: 'var(--warn-bg)',
  },
  OBESIDADE_GRAU_I: {
    label: 'Obesidade grau I',
    foregroundToken: 'var(--destructive-foreground)',
    backgroundToken: 'var(--destructive)',
  },
  OBESIDADE_GRAU_II: {
    label: 'Obesidade grau II',
    foregroundToken: 'var(--destructive-foreground)',
    backgroundToken: 'var(--destructive)',
  },
  OBESIDADE_GRAU_III: {
    label: 'Obesidade grau III',
    foregroundToken: 'var(--destructive-foreground)',
    backgroundToken: 'var(--destructive)',
  },
};

export function formatBmi(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function getBmiBadgeDisplay(
  classification: BmiClassification
): BmiBadgeDisplay {
  return BMI_BADGE_DISPLAY[classification];
}

export function getBmiStripTone(
  classification: BmiClassification
): BmiStripTone {
  return BMI_STRIP_TONE[classification];
}

export interface WeightVariationDisplay {
  text: string;
  colorToken: 'var(--muted-foreground)';
}

export function formatWeightVariation(
  variationKg: number
): WeightVariationDisplay {
  const rounded = Math.round(variationKg * 10) / 10;
  if (rounded === 0) {
    return {
      text: '0',
      colorToken: 'var(--muted-foreground)',
    };
  }
  const arrow = rounded > 0 ? '↑ ' : rounded < 0 ? '↓ ' : '';

  return {
    text: `${arrow}${Math.abs(rounded).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    })} kg`,
    colorToken: 'var(--muted-foreground)',
  };
}
