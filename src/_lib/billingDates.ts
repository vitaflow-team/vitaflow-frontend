import { todayInBrazil } from '@/_lib/studentsDates';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

/** `competenceMonth` is 1-12, as the backend sends it. */
export function monthName(competenceMonth: number): string {
  return MONTH_NAMES[competenceMonth - 1];
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function isIsoDay(value: string): boolean {
  return ISO_DAY.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** Calendar days between two `YYYY-MM-DD` values (b minus a); both are UTC midnight by construction. */
function daysBetween(a: string, b: string): number {
  return Math.round(
    (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS
  );
}

/** Whether `dueDate` is today (Brasília) through `maxDaysAhead` days from now. */
export function isDueDateInRange(
  dueDate: string,
  maxDaysAhead: number,
  today: string = todayInBrazil()
): boolean {
  if (!isIsoDay(dueDate)) return false;
  const days = daysBetween(today, dueDate);
  return days >= 0 && days <= maxDaysAhead;
}

/** The current competence (year, month) from today's Brasília date. */
export function currentCompetence(today: string = todayInBrazil()): {
  year: number;
  month: number;
} {
  const [year, month] = today.split('-').map(Number);
  return { year, month };
}

function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

/** Whether a competence is within `monthsWindow` months of the current one. */
export function isCompetenceInRange(
  year: number,
  month: number,
  monthsWindow: number,
  today: string = todayInBrazil()
): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month)) return false;
  if (month < 1 || month > 12) return false;
  const current = currentCompetence(today);
  const distance = Math.abs(
    monthIndex(year, month) - monthIndex(current.year, current.month)
  );
  return distance <= monthsWindow;
}

/** Whether a payment date (`YYYY-MM-DD`) is not in the future. */
export function isNotFutureDate(
  value: string,
  today: string = todayInBrazil()
): boolean {
  return isIsoDay(value) && daysBetween(today, value) <= 0;
}
