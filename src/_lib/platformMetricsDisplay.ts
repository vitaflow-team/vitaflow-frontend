import type { PlatformRole } from '@/_types/platformRole';

/**
 * Exact wording from `accountDirectoryView.tsx`'s `KIND_LABELS` map for these
 * four roles — never invent different wording for the same roles (task_02).
 */
export const ROLE_LABELS: Record<PlatformRole, string> = {
  USER: 'Usuário',
  NUTRITIONIST: 'Nutricionista',
  PHYSICAL_EDUCATOR: 'Educador físico',
  ACADEMIA: 'Academia',
};

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Formats an already-in-reais MRR figure (US-001.EC-3: readable, not truncated). */
export function formatMrr(value: number): string {
  return brlFormatter.format(value);
}

/** Formats a plain registered/churn count with thousands separators. */
export function formatCount(value: number): string {
  return value.toLocaleString('pt-BR');
}

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

/** Formats a "yyyy-MM" cohort month key as e.g. "Nov/2025" (cohort-ltv-analysis). */
export function formatCohortMonthLabel(cohortMonth: string): string {
  const [year, month] = cohortMonth.split('-');
  const monthIndex = Number(month) - 1;
  return `${MONTH_LABELS[monthIndex]}/${year}`;
}

export interface MrrTrendDisplay {
  label: string;
  tone: 'positive' | 'negative' | 'neutral' | 'unavailable';
}

/**
 * The MRR month-over-month comparison, distinguishing "Asaas unavailable"
 * (`null`) from "Asaas returned zero" (`0`) — never the same rendering
 * (ADR-005, ADR-006).
 */
export function computeMrrTrend(
  current: number,
  previousMonth: number | null
): MrrTrendDisplay {
  if (previousMonth === null) {
    return { label: 'Comparação indisponível', tone: 'unavailable' };
  }
  if (previousMonth === 0) {
    if (current === 0) return { label: 'Sem variação', tone: 'neutral' };
    return {
      label: `+${formatMrr(current)} vs mês anterior`,
      tone: 'positive',
    };
  }

  const percent = ((current - previousMonth) / previousMonth) * 100;
  const rounded = Math.round(percent * 10) / 10;
  if (rounded === 0) return { label: '0% vs mês anterior', tone: 'neutral' };

  const sign = rounded > 0 ? '+' : '';
  return {
    label: `${sign}${rounded.toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    })}% vs mês anterior`,
    tone: rounded > 0 ? 'positive' : 'negative',
  };
}
