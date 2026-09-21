'use client';

import { Button } from '@/_components/ui/button';
import { useHoldRepeat } from '@/_hooks/useHoldRepeat';
import { cn } from '@/_lib/utils';
import { Minus, Plus } from 'lucide-react';

interface WeightStepButtonProps {
  direction: 1 | -1;
  disabled?: boolean;
  onStep: () => void;
  /** Consultada a cada repetição para parar exatamente no limite. */
  canStep: () => boolean;
  className?: string;
}

/**
 * Botão compartilhado pelo diálogo e pela folha (ADR-003): alvo de 44 px,
 * nome acessível fixo e repetição ao segurar vinda de `useHoldRepeat`.
 */
export function WeightStepButton({
  direction,
  disabled = false,
  onStep,
  canStep,
  className,
}: WeightStepButtonProps) {
  const handlers = useHoldRepeat(onStep, { disabled, canContinue: canStep });
  const Icon = direction === 1 ? Plus : Minus;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      className={cn('size-11 shrink-0 rounded-full', className)}
      aria-label={direction === 1 ? 'Aumentar peso' : 'Diminuir peso'}
      disabled={disabled}
      {...handlers}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
