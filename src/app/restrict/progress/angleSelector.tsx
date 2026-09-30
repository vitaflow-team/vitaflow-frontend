'use client';

import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group';
import type { PhotoAngle } from '@/_types/progressPhotos';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const ANGLE_OPTIONS: { value: PhotoAngle; label: string }[] = [
  { value: 'FRONT', label: 'Frente' },
  { value: 'SIDE', label: 'Lado' },
  { value: 'BACK', label: 'Costas' },
];

interface AngleSelectorProps {
  value: PhotoAngle;
}

// Switching angle intentionally drops any in-progress comparison selection
// (`compareA`/`compareB`) — a stale pick from a different angle would no
// longer make sense.
export function AngleSelector({ value }: AngleSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    if (next === value) return;
    startTransition(() => {
      router.replace(`/restrict/progress?tab=fotos&angle=${next}`, {
        scroll: false,
      });
    });
  }

  return (
    <RadioGroup
      aria-label="Ângulo da foto"
      value={value}
      onValueChange={handleChange}
      data-pending={isPending ? '' : undefined}
      className="bg-muted grid w-full grid-cols-3 gap-1 rounded-lg p-1 data-[pending]:opacity-70 sm:w-auto sm:max-w-xs"
    >
      {ANGLE_OPTIONS.map(option => (
        <RadioGroupItem
          key={option.value}
          value={option.value}
          className="text-muted-foreground focus-visible:ring-ring/50 focus-visible:outline-ring data-[state=checked]:bg-background data-[state=checked]:text-foreground inline-flex h-11 min-w-0 items-center justify-center rounded-md px-1 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:outline-1 data-[state=checked]:shadow-sm"
        >
          {option.label}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
