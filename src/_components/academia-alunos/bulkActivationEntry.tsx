import { availabilityHint } from '@/_lib/gymBillingAvailability';
import { settingsTabHref } from '@/_lib/settingsTabs';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import Link from 'next/link';
import { BulkActivationDialog } from './bulkActivationDialog';

interface BulkActivationEntryProps {
  billing: GymBillingAvailability;
}

/** The way into bulk activation, or why it is unavailable until billing is connected (US-015.AC-4). */
export function BulkActivationEntry({ billing }: BulkActivationEntryProps) {
  const hint = availabilityHint(billing);
  if (!hint) return <BulkActivationDialog />;

  return (
    <p className="text-muted-foreground max-w-sm text-sm">
      {hint}{' '}
      <Link
        href={settingsTabHref('cobranca')}
        className="text-primary underline underline-offset-4 hover:no-underline"
      >
        Abrir cobrança
      </Link>
    </p>
  );
}
