const BRAZIL_TIME_ZONE = 'America/Sao_Paulo';
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Today as a `YYYY-MM-DD` calendar date in Brasília time. */
export function todayInBrazil(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRAZIL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** `2026-09-15` → `15/09/2026`, without going through a Date (no time zone shift). */
export function formatIsoDay(isoDay: string): string {
  const match = ISO_DAY.exec(isoDay);
  if (!match) return isoDay;

  return `${match[3]}/${match[2]}/${match[1]}`;
}

/** Whole years between a `YYYY-MM-DD` birth date and today, or null when unusable. */
export function ageInYears(
  birthDate: string | null,
  today: string = todayInBrazil()
): number | null {
  const born = birthDate ? ISO_DAY.exec(birthDate) : null;
  const now = ISO_DAY.exec(today);
  if (!born || !now) return null;

  const [bornYear, bornMonth, bornDay] = born.slice(1).map(Number);
  const [nowYear, nowMonth, nowDay] = now.slice(1).map(Number);
  const hadBirthday =
    nowMonth > bornMonth || (nowMonth === bornMonth && nowDay >= bornDay);

  return nowYear - bornYear - (hadBirthday ? 0 : 1);
}

/** "setembro de 2026" from a creation timestamp. */
export function formatMemberSince(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString('pt-BR', {
    timeZone: BRAZIL_TIME_ZONE,
    month: 'long',
    year: 'numeric',
  });
}

/** Shifts a `YYYY-MM-DD` day by whole years (used for the age limits). */
export function shiftYears(isoDay: string, years: number): string {
  const match = ISO_DAY.exec(isoDay);
  if (!match) return isoDay;

  return `${Number(match[1]) + years}-${match[2]}-${match[3]}`;
}
