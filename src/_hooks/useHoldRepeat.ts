'use client';

import { HOLD_DELAY_MS, repeatIntervalMs } from '@/_lib/weightStepper';
import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';

interface HoldRepeatOptions {
  disabled?: boolean;
  /** Consultada antes de cada repetição: `false` encerra o ciclo no limite. */
  canContinue?: () => boolean;
}

interface HoldRepeatHandlers {
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Um passo no pointer-down e, depois de `HOLD_DELAY_MS`, repetição acelerada
 * pelo cronograma puro. Solta, sai, cancela, perde foco, desmonta ou bate no
 * limite: para. Enter e Espaço dão exatamente um passo, sem repetir.
 */
export function useHoldRepeat(
  onStep: () => void,
  { disabled = false, canContinue }: HoldRepeatOptions = {}
): HoldRepeatHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatCountRef = useRef(0);
  const onStepRef = useRef(onStep);
  const canContinueRef = useRef(canContinue);

  onStepRef.current = onStep;
  canContinueRef.current = canContinue;

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    repeatCountRef.current = 0;
  }, []);

  const scheduleRepeat = useCallback(() => {
    const interval = repeatIntervalMs(repeatCountRef.current);

    timerRef.current = setTimeout(() => {
      if (canContinueRef.current && !canContinueRef.current()) {
        stop();
        return;
      }

      onStepRef.current();
      repeatCountRef.current += 1;
      scheduleRepeat();
    }, interval);
  }, [stop]);

  const start = useCallback(() => {
    if (disabled) return;

    stop();
    onStepRef.current();
    timerRef.current = setTimeout(() => {
      repeatCountRef.current = 0;
      scheduleRepeat();
    }, HOLD_DELAY_MS);
  }, [disabled, scheduleRepeat, stop]);

  // Um pointer-up perdido fora do botão (ou a janela indo para trás) deixaria
  // a repetição rodando sozinha; estes ouvintes globais fecham essa brecha.
  useEffect(() => {
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    window.addEventListener('blur', stop);

    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      window.removeEventListener('blur', stop);
      stop();
    };
  }, [stop]);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    // Sem isto o navegador ainda sintetizaria um clique depois do keyup e o
    // teclado daria dois passos.
    event.preventDefault();
    if (event.repeat || disabled) return;

    onStepRef.current();
  }

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerCancel: stop,
    onPointerLeave: stop,
    onBlur: stop,
    onKeyDown: handleKeyDown,
  };
}
