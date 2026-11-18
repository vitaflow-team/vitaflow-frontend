import Link from 'next/link';

interface PanelNoticeProps {
  message: string;
  actionHref?: string;
  actionLabel?: string;
  /** `alert` is announced at once; use it only for what needs the reader's action. */
  role?: 'alert' | 'status';
}

/** A notice with text and an optional action; never relies on color to be understood. */
export function PanelNotice({
  message,
  actionHref,
  actionLabel,
  role = 'status',
}: PanelNoticeProps) {
  return (
    <div
      role={role}
      className="flex flex-col gap-2 rounded-lg border border-dashed px-4 py-4 text-sm"
    >
      <p>{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="text-primary font-medium underline underline-offset-4 hover:no-underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
