import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { formatDecimal } from './decimalInput';

export type LatestState =
  | { status: 'loading'; token: number }
  | {
      status: 'ready';
      token: number;
      record: MeasurementRecordResponseDTO | null;
    }
  | { status: 'failed'; token: number };

export type LatestEvent =
  | { type: 'reset'; token: number }
  | {
      type: 'resolved';
      token: number;
      record: MeasurementRecordResponseDTO | null;
    }
  | { type: 'rejected'; token: number };

/**
 * Cada abertura do formulário gera um token novo. Respostas de aberturas
 * anteriores chegam com o token antigo e são descartadas, para que uma
 * requisição lenta nunca sobrescreva a tela atual.
 */
export function latestReducer(
  state: LatestState,
  event: LatestEvent
): LatestState {
  if (event.type === 'reset') {
    return { status: 'loading', token: event.token };
  }

  if (event.token !== state.token) {
    return state;
  }

  if (event.type === 'resolved') {
    return { status: 'ready', token: state.token, record: event.record };
  }

  return { status: 'failed', token: state.token };
}

/** Valores iniciais do formulário de novo registro, já no formato do campo. */
export function initialFormValues(
  record: MeasurementRecordResponseDTO | null
): { weightKg: string; heightCm: string } {
  if (!record) {
    return { weightKg: '', heightCm: '' };
  }

  return {
    weightKg: formatDecimal(record.weightKg),
    heightCm: formatDecimal(record.heightCm),
  };
}
