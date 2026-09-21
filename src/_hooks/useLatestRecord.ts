'use client';

import { actionGetLatestRecord } from '@/_actions/progress/getLatestRecord';
import { latestReducer, type LatestState } from '@/_lib/latestRecord';
import { useEffect, useReducer, useRef } from 'react';
import { useServerAction } from 'zsa-react';

const INITIAL_STATE: LatestState = { status: 'loading', token: 0 };

/**
 * Busca o último registro a cada abertura (ADR-001). `openToken` muda a cada
 * abertura e `null` significa fechado; a resposta de uma abertura anterior
 * chega com o token antigo e é descartada pelo reducer. Uma falha vira "sem
 * histórico", nunca um erro exibido.
 */
export function useLatestRecord(openToken: number | null): LatestState {
  const [state, dispatch] = useReducer(latestReducer, INITIAL_STATE);
  const { execute } = useServerAction(actionGetLatestRecord);
  const executeRef = useRef(execute);

  executeRef.current = execute;

  useEffect(() => {
    if (openToken === null) return;

    dispatch({ type: 'reset', token: openToken });

    void executeRef.current().then(([record, error]) => {
      if (error) {
        dispatch({ type: 'rejected', token: openToken });
        return;
      }

      dispatch({ type: 'resolved', token: openToken, record: record ?? null });
    });
  }, [openToken]);

  if (openToken === null) return INITIAL_STATE;

  // O efeito da abertura só roda depois desta renderização. Sem isto o
  // resultado da abertura anterior apareceria por um quadro antes do esqueleto.
  if (state.token !== openToken) {
    return { status: 'loading', token: openToken };
  }

  return state;
}
