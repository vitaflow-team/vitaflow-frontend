import type { MealPlanDay, Weekday } from '@/_types/mealPlan';

export const WEEKDAY_ORDER: Weekday[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  MONDAY: 'Segunda',
  TUESDAY: 'Terça',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

/**
 * One slot per weekday, always all 7 in order — the draft itself only ever
 * holds rows for weekdays someone has saved meals to (a brand-new draft has
 * none at all), so the full week is reconstructed here for display.
 */
export function fullWeek(days: MealPlanDay[]): Array<{
  weekday: Weekday;
  day: MealPlanDay | null;
}> {
  const byWeekday = new Map(days.map(day => [day.weekday, day]));
  return WEEKDAY_ORDER.map(weekday => ({
    weekday,
    day: byWeekday.get(weekday) ?? null,
  }));
}

export function hasContent(day: MealPlanDay | null): boolean {
  return (day?.meals.length ?? 0) > 0;
}
