'use client';

import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group';
import { PERIOD_OPTIONS, type Period } from '@/_lib/progressPeriod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface PeriodSelectorProps {
  value: Period;
}

/**
 * Controle segmentado de 4 / 8 / 12 semanas (ADR-009). A escolha vive no
 * endereço: mudar de opção reescreve `?semanas=` dentro de uma transição, então
 * o Server Component refaz a página sem rolar a tela nem navegar de verdade.
 */
export function PeriodSelector({ value }: PeriodSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    if (next === String(value)) return;

    startTransition(() => {
      router.replace(`?semanas=${next}`, { scroll: false });
    });
  }

  return (
    <RadioGroup
      aria-label="Período dos gráficos"
      value={String(value)}
      onValueChange={handleChange}
      data-pending={isPending ? '' : undefined}
      className="bg-muted grid w-full grid-cols-3 gap-1 rounded-lg p-1 data-[pending]:opacity-70 sm:w-auto sm:max-w-xs"
    >
      {PERIOD_OPTIONS.map(option => (
        <RadioGroupItem
          key={option}
          value={String(option)}
          className="text-muted-foreground focus-visible:ring-ring/50 focus-visible:outline-ring data-[state=checked]:bg-background data-[state=checked]:text-foreground inline-flex h-11 min-w-0 items-center justify-center rounded-md px-1 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:outline-1 data-[state=checked]:shadow-sm sm:px-2 sm:text-sm"
        >
          {option} semanas
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
