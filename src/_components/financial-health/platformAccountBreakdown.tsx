import { PLATFORM_ROLES } from '@/_constants/platformRoles';
import { ROLE_LABELS } from '@/_lib/platformMetricsDisplay';
import type { PlatformAccountTotals } from '@/_types/platformAccountTotals';
import type { PlatformOverdue } from '@/_types/platformOverdue';
import { PlatformAccountCard } from './platformAccountCard';

interface PlatformAccountBreakdownProps {
  byAccountType: PlatformAccountTotals;
  overdue: PlatformOverdue;
}

/** The month and today's overdue situation by account type: student, nutritionist, educator and gym. */
export function PlatformAccountBreakdown({
  byAccountType,
  overdue,
}: PlatformAccountBreakdownProps) {
  return (
    <section
      aria-labelledby="platform-accounts-heading"
      className="flex flex-col gap-2"
    >
      <h2 id="platform-accounts-heading" className="text-lg font-semibold">
        Por tipo de conta
      </h2>
      <ul className="flex flex-col gap-2">
        {PLATFORM_ROLES.map(role => (
          <PlatformAccountCard
            key={role}
            label={ROLE_LABELS[role]}
            totals={byAccountType[role]}
            overdue={overdue.byAccountType[role]}
          />
        ))}
      </ul>
    </section>
  );
}
