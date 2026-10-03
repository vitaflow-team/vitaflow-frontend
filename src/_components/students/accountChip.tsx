import { UserCheck, UserX } from 'lucide-react';

interface AccountChipProps {
  hasAccount: boolean;
}

/**
 * Whether the student has a Vita Flow account. The state is in the text and
 * the icon shape, never in color alone.
 */
export function AccountChip({ hasAccount }: AccountChipProps) {
  const Icon = hasAccount ? UserCheck : UserX;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs font-medium">
      <Icon className="size-3" aria-hidden="true" />
      {hasAccount ? 'Com conta' : 'Sem conta'}
    </span>
  );
}
