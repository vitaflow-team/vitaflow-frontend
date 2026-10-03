import { WEEKDAY_NAMES } from '@/_constants/educatorScheduleLimits';

const SAO_PAULO = 'America/Sao_Paulo';

/** "07:00" from minutes after midnight. */
export function formatClock(startMinute: number): string {
  const hours = Math.floor(startMinute / 60);
  const minutes = startMinute % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** "Segunda-feira" for ISO weekday 1..7; empty for anything else. */
export function weekdayName(weekday: number): string {
  return WEEKDAY_NAMES[weekday] ?? '';
}

/** "07:00 às 08:00" for a start and a duration in minutes. */
export function formatTimeRange(
  startMinute: number,
  durationMinutes: number
): string {
  return `${formatClock(startMinute)} às ${formatClock(startMinute + durationMinutes)}`;
}

/** "Seg., 12/10, 07:00" in Brasília time, for a coming session. */
export function formatSessionWhen(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: SAO_PAULO,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** The Brasília weekday (ISO 1..7) of an instant. */
export function brtWeekday(iso: string): number {
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: SAO_PAULO,
    weekday: 'short',
  }).format(new Date(iso));
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return order.indexOf(day) + 1;
}

/** "23/10" in Brasília time, for a canceled or coming date. */
export function formatSessionDay(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: SAO_PAULO,
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(iso));
}

/** Minutes after midnight in Brasília time for an instant (UTC-3, no DST since 2019). */
export function brtStartMinute(iso: string): number {
  const date = new Date(iso);
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes() - 180;
  return ((minutes % 1440) + 1440) % 1440;
}
