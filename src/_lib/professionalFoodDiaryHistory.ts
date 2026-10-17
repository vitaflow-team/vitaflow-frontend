import type { Meal } from '@/_types/foodDiary';
import type { WaterLogEntry } from '@/_types/professionalFoodDiary';

export interface DiaryDay {
  /** Calendar date, `YYYY-MM-DD`. */
  date: string;
  meals: Meal[];
  waterCount: number;
}

/** Groups the full meal/water history by calendar day, newest first. */
export function groupByDay(
  meals: Meal[],
  waterLogs: WaterLogEntry[]
): DiaryDay[] {
  const days = new Map<string, DiaryDay>();

  function dayFor(date: string): DiaryDay {
    const existing = days.get(date);
    if (existing) return existing;
    const created: DiaryDay = { date, meals: [], waterCount: 0 };
    days.set(date, created);
    return created;
  }

  for (const meal of meals) {
    dayFor(meal.loggedAt.slice(0, 10)).meals.push(meal);
  }
  for (const log of waterLogs) {
    dayFor(log.date).waterCount = log.count;
  }

  return [...days.values()].sort((a, b) => b.date.localeCompare(a.date));
}
