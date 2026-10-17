import { groupByDay } from '@/_lib/professionalFoodDiaryHistory';
import type { ProfessionalFoodDiary } from '@/_types/professionalFoodDiary';
import { DiaryDayCard } from './diaryDayCard';

interface FoodDiarySectionProps {
  diary: ProfessionalFoodDiary;
}

/**
 * A patient's food-diary history, read only (US-016). "No linked account"
 * and "linked but never used the diary" are two distinct empty states —
 * never the same message, since they mean different things to act on.
 */
export function FoodDiarySection({ diary }: FoodDiarySectionProps) {
  if (!diary.hasAccount) {
    return (
      <p className="text-sm text-muted-foreground">
        Este paciente ainda não tem uma conta vinculada — o diário alimentar
        fica disponível assim que a conta for criada e conectada.
      </p>
    );
  }

  const days = groupByDay(diary.meals, diary.waterLogs);
  if (days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este paciente ainda não registrou nenhuma refeição ou copo de água no
        diário alimentar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {days.map(day => (
        <DiaryDayCard key={day.date} day={day} />
      ))}
    </div>
  );
}
