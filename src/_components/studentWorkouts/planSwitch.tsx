import { cn } from '@/_lib/utils';
import { planHref, type PlanOption } from '@/_lib/studentPlans';
import Link from 'next/link';

interface PlanSwitchProps {
  options: PlanOption[];
  selectedKey: string;
}

/**
 * Links, not buttons: the selected plan lives in the address, so the
 * notification and the mirror can point straight at the educator's workout
 * and the choice survives a reload.
 */
export function PlanSwitch({ options, selectedKey }: PlanSwitchProps) {
  return (
    <nav
      aria-label="Escolha o treino"
      className="flex gap-1 overflow-x-auto border-b border-line"
    >
      {options.map(option => {
        const selected = option.key === selectedKey;

        return (
          <Link
            key={option.key}
            href={planHref(option.key)}
            aria-current={selected ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center border-b-2 border-transparent px-3 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
              selected && 'border-primary font-semibold text-foreground'
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
