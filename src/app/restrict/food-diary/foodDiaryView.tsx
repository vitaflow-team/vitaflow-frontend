import DefaultLayout from '@/_components/layout/defaultLayout';
import { Title } from '@/_components/ui/title';
import {
  isLoadFailure,
  loadDailySummary,
  loadMissingProfileFields,
  todayDateParam,
} from '@/_lib/foodDiaryData';
import { auth } from '@/auth';
import { LoadFailureNotice } from './loadFailureNotice';
import { MealList } from './mealList';
import { MealLoggingForm } from './mealLoggingForm';
import { ProfileCompletionPrompt } from './profileCompletionPrompt';
import { SummaryCards } from './summaryCards';

/** The validated prototype's diary screen: three summary cards, the
 * meal-logging form, the meal list, and — only when fields are actually
 * missing — the first-time profile-completion prompt (US-005). */
export default async function FoodDiaryView() {
  const session = await auth();
  if (!session?.user) return null;

  const date = todayDateParam();
  const [summary, missingFields] = await Promise.all([
    loadDailySummary(date),
    loadMissingProfileFields(),
  ]);

  if (isLoadFailure(summary)) {
    return (
      <DefaultLayout>
        <LoadFailureNotice />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <Title label="Diário Alimentar" />

        {!isLoadFailure(missingFields) && missingFields.length > 0 && (
          <ProfileCompletionPrompt missingFields={missingFields} />
        )}

        <SummaryCards summary={summary} date={date} />

        <MealLoggingForm />

        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
            Refeições de hoje
          </h2>
          <MealList meals={summary.meals} />
        </div>
      </div>
    </DefaultLayout>
  );
}
