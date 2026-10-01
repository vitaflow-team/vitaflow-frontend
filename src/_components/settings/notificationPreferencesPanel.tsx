'use client';

import { actionSetPreference } from '@/_actions/notifications/setPreference';
import { Checkbox } from '@/_components/ui/checkbox';
import { Label } from '@/_components/ui/label';
import { useAlertHook } from '@/_hooks/alertHook';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CATEGORY_LABELS,
} from '@/_lib/notificationCategoryLabels';
import type { NotificationPreferences } from '@/_types/notifications';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface NotificationPreferencesPanelProps {
  preferences: NotificationPreferences;
}

// Every category is shown and toggleable even when nothing yet triggers it
// (US-007) — the row never implies an active reminder exists, it only
// states the user's stored preference for when one does.
export function NotificationPreferencesPanel({
  preferences,
}: NotificationPreferencesPanelProps) {
  const { openError } = useAlertHook();
  const { execute } = useServerAction(actionSetPreference);
  const [state, setState] = useState(preferences);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  async function handleToggle(
    category: keyof NotificationPreferences,
    checked: boolean
  ) {
    const previous = state[category];
    setState(current => ({ ...current, [category]: checked }));
    setPendingCategory(category);

    const [, error] = await execute({ category, enabled: checked });
    setPendingCategory(null);

    if (error) {
      setState(current => ({ ...current, [category]: previous }));
      openError(error.message, 'Não foi possível salvar', 'error');
    }
  }

  return (
    <ul className="flex flex-col gap-1">
      {NOTIFICATION_CATEGORIES.map(category => {
        const id = `notification-preference-${category}`;
        return (
          <li
            key={category}
            className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0"
          >
            <Label htmlFor={id} className="text-sm font-normal">
              {NOTIFICATION_CATEGORY_LABELS[category]}
            </Label>
            <Checkbox
              id={id}
              checked={state[category]}
              disabled={pendingCategory === category}
              onCheckedChange={checked =>
                void handleToggle(category, checked === true)
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
