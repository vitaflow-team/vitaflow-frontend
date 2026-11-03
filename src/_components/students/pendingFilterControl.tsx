import { cn } from '@/_lib/utils';
import { studentsHref } from '@/_lib/studentsList';
import Link from 'next/link';

interface PendingFilterControlProps {
  pending?: boolean;
  search?: string;
  order?: 'name';
}

/** Toggles the "Pendentes" filter; hidden entirely for non-Premium (US-012). */
export function PendingFilterControl({
  pending,
  search,
  order,
}: PendingFilterControlProps) {
  const href = studentsHref({
    search,
    order,
    page: 1,
    pending: pending ? undefined : true,
  });

  return (
    <Link
      href={href}
      aria-current={pending ? 'true' : undefined}
      className={cn(
        'inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
        pending
          ? 'border-primary text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      Pendentes
    </Link>
  );
}
