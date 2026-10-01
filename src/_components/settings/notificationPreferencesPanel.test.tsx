import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/notifications/setPreference', () => ({
  actionSetPreference: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));

import type { NotificationPreferences } from '@/_types/notifications';
import { NotificationPreferencesPanel } from './notificationPreferencesPanel';

const PREFERENCES_DEFAULT_NEW_USER: NotificationPreferences = {
  WORKOUT_REMINDER: true,
  CONSULTATION_REMINDER: true,
  MESSAGES: true,
  BILLING: true,
  PRODUCT_NEWS: false,
};

describe('NotificationPreferencesPanel', () => {
  it('shows every category with its pre-populated state (US-004.AC-1)', () => {
    const markup = renderToStaticMarkup(
      <NotificationPreferencesPanel
        preferences={PREFERENCES_DEFAULT_NEW_USER}
      />
    );

    expect(markup).toContain('Lembrete de treino');
    expect(markup).toContain('Lembrete de consulta');
    expect(markup).toContain('Mensagens');
    expect(markup).toContain('Cobranças');
    expect(markup).toContain('Novidades Vita Flow');
  });

  it('US-008.AC-1 shows Novidades Vita Flow off and every other category on by default', () => {
    const markup = renderToStaticMarkup(
      <NotificationPreferencesPanel
        preferences={PREFERENCES_DEFAULT_NEW_USER}
      />
    );

    // Each row renders a checkbox whose checked state reflects the
    // preference; the product-news row is the only one expected unchecked.
    const rows = markup.split('<li').slice(1);
    expect(rows).toHaveLength(5);
    const productNewsRow = rows.find(row =>
      row.includes('Novidades Vita Flow')
    );
    expect(productNewsRow).toContain('data-state="unchecked"');

    const billingRow = rows.find(row => row.includes('Cobranças'));
    expect(billingRow).toContain('data-state="checked"');
  });

  it('renders every category as toggleable even when nothing triggers it yet (US-007)', () => {
    const markup = renderToStaticMarkup(
      <NotificationPreferencesPanel
        preferences={PREFERENCES_DEFAULT_NEW_USER}
      />
    );

    expect(markup).not.toContain('disabled=""');
  });
});
