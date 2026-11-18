import Link from 'next/link';

interface PaginationLinkProps {
  href: string;
  label: string;
  /** Spoken name when the visible label is only a number or an arrow. */
  ariaLabel?: string;
  current?: boolean;
}

/** A page link; the current page is marked for assistive technology, not only by style. */
export function PaginationLink({
  href,
  label,
  ariaLabel,
  current = false,
}: PaginationLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={current ? 'page' : undefined}
      className={
        current
          ? 'bg-primary text-primary-foreground inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-semibold'
          : 'hover:bg-accent inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm'
      }
    >
      {label}
    </Link>
  );
}
