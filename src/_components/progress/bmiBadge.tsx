import { getBmiBadgeDisplay } from '@/_lib/progressDisplay';
import type { BmiClassification } from '@/_lib/bmi';

interface BmiBadgeProps {
  classification: BmiClassification;
}

export function BmiBadge({ classification }: BmiBadgeProps) {
  const display = getBmiBadgeDisplay(classification);

  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        color: display.foregroundToken,
        backgroundColor: display.backgroundToken,
      }}
    >
      {display.label}
    </span>
  );
}
