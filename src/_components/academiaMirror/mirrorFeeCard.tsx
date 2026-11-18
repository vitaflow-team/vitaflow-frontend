import type { MembershipFee } from '@/_types/membershipFee';
import { MirrorFeeRow } from './mirrorFeeRow';

interface MirrorFeeCardProps {
  fees: MembershipFee[];
}

/** The student's own monthly fees; renders nothing when the gym has issued none (US-017). */
export function MirrorFeeCard({ fees }: MirrorFeeCardProps) {
  if (fees.length === 0) return null;

  return (
    <section aria-label="Mensalidades" className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold">Mensalidades</h4>
      <ul className="flex flex-col gap-2">
        {fees.map(fee => (
          <MirrorFeeRow key={fee.id} fee={fee} />
        ))}
      </ul>
    </section>
  );
}
