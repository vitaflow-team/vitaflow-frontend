import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailySummary } from '@/_types/foodDiary';

const { authMock, loadDailySummaryMock, loadMissingProfileFieldsMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    loadDailySummaryMock: vi.fn(),
    loadMissingProfileFieldsMock: vi.fn(),
  }));

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/foodDiaryData', () => ({
  loadDailySummary: loadDailySummaryMock,
  loadMissingProfileFields: loadMissingProfileFieldsMock,
  todayDateParam: () => '2026-09-30',
  isLoadFailure: (result: unknown) => typeof result === 'string',
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('./summaryCards', () => ({
  SummaryCards: () => <i data-testid="summary-cards" />,
}));
vi.mock('./mealLoggingForm', () => ({
  MealLoggingForm: () => <i data-testid="logging-form" />,
}));
vi.mock('./mealList', () => ({
  MealList: () => <i data-testid="meal-list" />,
}));
vi.mock('./profileCompletionPrompt', () => ({
  ProfileCompletionPrompt: ({ missingFields }: { missingFields: string[] }) => (
    <i data-testid="profile-prompt" data-fields={missingFields.join(',')} />
  ),
}));
vi.mock('./loadFailureNotice', () => ({
  LoadFailureNotice: () => <i data-testid="load-failure" />,
}));

import FoodDiaryView from './foodDiaryView';

const SUMMARY: DailySummary = {
  meals: [],
  totalCalories: 0,
  goal: null,
  waterCount: 0,
  streak: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ user: { id: 'user-1' } });
  loadMissingProfileFieldsMock.mockResolvedValue([]);
});

describe('FoodDiaryView', () => {
  it('renders nothing without a session', async () => {
    authMock.mockResolvedValue(null);

    expect(await FoodDiaryView()).toBeNull();
  });

  it('shows a load-failure notice when the summary fails to load', async () => {
    loadDailySummaryMock.mockResolvedValue('failed');

    const markup = renderToStaticMarkup(await FoodDiaryView());

    expect(markup).toContain('data-testid="load-failure"');
  });

  it('renders the summary cards, form and meal list when the summary loads', async () => {
    loadDailySummaryMock.mockResolvedValue(SUMMARY);

    const markup = renderToStaticMarkup(await FoodDiaryView());

    expect(markup).toContain('data-testid="summary-cards"');
    expect(markup).toContain('data-testid="logging-form"');
    expect(markup).toContain('data-testid="meal-list"');
  });

  it('shows the profile-completion prompt only when fields are actually missing', async () => {
    loadDailySummaryMock.mockResolvedValue(SUMMARY);
    loadMissingProfileFieldsMock.mockResolvedValue([]);

    const withoutPrompt = renderToStaticMarkup(await FoodDiaryView());
    expect(withoutPrompt).not.toContain('data-testid="profile-prompt"');

    loadMissingProfileFieldsMock.mockResolvedValue(['sex', 'goal']);
    const withPrompt = renderToStaticMarkup(await FoodDiaryView());
    expect(withPrompt).toContain('data-testid="profile-prompt"');
    expect(withPrompt).toContain('data-fields="sex,goal"');
  });
});
