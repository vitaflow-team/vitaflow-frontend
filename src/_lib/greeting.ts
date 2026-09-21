export type Greeting = 'Bom dia' | 'Boa tarde' | 'Boa noite';

/**
 * Sem `timeZone` o Intl usa o fuso do ambiente, que é o que queremos no cliente
 * depois da montagem. O servidor passa um fuso explícito para a primeira
 * renderização ser determinística e não divergir na hidratação.
 */
function timeZoneOption(timeZone?: string) {
  return timeZone ? { timeZone } : {};
}

function getHour(date: Date, timeZone?: string): number {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    hourCycle: 'h23',
    ...timeZoneOption(timeZone),
  }).format(date);

  return Number.parseInt(formatted, 10);
}

/** 05:00–11:59 "Bom dia", 12:00–17:59 "Boa tarde", o resto "Boa noite". */
export function getGreeting(date: Date, timeZone?: string): Greeting {
  const hour = getHour(date, timeZone);

  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Data por extenso em português: "sábado, 19 de setembro". */
export function formatLongDate(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...timeZoneOption(timeZone),
  }).format(date);
}

/** Sem nome não sobra vírgula solta na saudação. */
export function buildGreetingLine(
  greeting: Greeting,
  firstName: string
): string {
  const name = firstName.trim();
  return name ? `${greeting}, ${name}` : greeting;
}
