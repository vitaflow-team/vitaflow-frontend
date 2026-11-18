import { FINANCIAL_MONTHS_BACK } from '@/_constants/financialHealth';
import { monthName } from '@/_lib/billingDates';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { FinancialSearchParams } from '@/_types/financialSearchParams';
import type { MonthOption } from '@/_types/monthOption';

const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;
const MAX_PAGE = 1_000_000;

function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

function monthKeyOf(index: number): string {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

function currentMonthIndex(today: string): number {
  const [year, month] = today.split('-').map(Number);
  return monthIndex(year, month);
}

/**
 * The month a panel opens on: the requested `YYYY-MM` when it is the current
 * month or one of the 12 before it, the current month otherwise (invalid,
 * repeated, future or too old). `today` is a Brasília `YYYY-MM-DD`.
 */
export function normalizeMonth(
  raw: string | string[] | undefined,
  today: string
): string {
  const current = currentMonthIndex(today);
  const match = typeof raw === 'string' ? MONTH_PATTERN.exec(raw) : null;
  if (!match) return monthKeyOf(current);

  const month = Number(match[2]);
  const distance = current - monthIndex(Number(match[1]), month);
  const inWindow = distance >= 0 && distance <= FINANCIAL_MONTHS_BACK;
  return month >= 1 && month <= 12 && inWindow
    ? `${match[1]}-${match[2]}`
    : monthKeyOf(current);
}

/** A positive whole number, or page 1 for anything else. */
export function normalizePage(raw: string | string[] | undefined): number {
  const page = typeof raw === 'string' ? Number(raw) : Number.NaN;
  return Number.isInteger(page) && page >= 1 ? Math.min(page, MAX_PAGE) : 1;
}

/** "Março de 2026" from `2026-03`. */
export function monthLabel(month: string): string {
  const match = MONTH_PATTERN.exec(month);
  if (!match) return month;
  return `${monthName(Number(match[2]))} de ${match[1]}`;
}

/** The current month and the 12 before it, newest first. */
export function monthOptions(today: string): MonthOption[] {
  const current = currentMonthIndex(today);
  return Array.from({ length: FINANCIAL_MONTHS_BACK + 1 }, (_, back) => {
    const value = monthKeyOf(current - back);
    return { value, label: monthLabel(value) };
  });
}

/** The address of a panel view: `page` is left out on the first page. */
export function panelHref(path: string, query: FinancialPanelQuery): string {
  const params = new URLSearchParams({ month: query.month });
  if (query.page > 1) params.set('page', String(query.page));
  return `${path}?${params.toString()}`;
}

/** The validated query of a panel address; `today` is a Brasília `YYYY-MM-DD`. */
export function resolvePanelQuery(
  params: FinancialSearchParams,
  today: string
): FinancialPanelQuery {
  return {
    month: normalizeMonth(params.month, today),
    page: normalizePage(params.page),
  };
}
