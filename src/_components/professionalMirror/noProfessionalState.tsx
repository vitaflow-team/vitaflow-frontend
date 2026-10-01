import { PROFESSIONAL_DISCOVERY_PATH } from '@/_lib/professionalDiscoveryTabs';
import Link from 'next/link';

interface NoProfessionalStateProps {
  message: string;
}

// US-003/US-004: a distinct state from the honest-empty-section treatment —
// this means no relationship exists at all, not that one exists with
// not-yet-real data — with a direct path into Professional Discovery so the
// screen is never a dead end.
export function NoProfessionalState({ message }: NoProfessionalStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <p className="text-muted-foreground text-sm">{message}</p>
      <Link
        href={`${PROFESSIONAL_DISCOVERY_PATH}?tab=buscar`}
        className="text-primary text-sm underline-offset-4 hover:underline"
      >
        Buscar profissional
      </Link>
    </div>
  );
}
