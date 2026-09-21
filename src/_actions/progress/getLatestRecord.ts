'use server';

import { apiClient } from '@/_lib/apiClient';
import type {
  LatestRecordResponseDTO,
  MeasurementRecordResponseDTO,
} from '@/_types/progress';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

/**
 * Último registro do usuário autenticado. O backend responde com o invólucro
 * `{ latest }` justamente para que "sem histórico" continue sendo um JSON
 * válido; aqui ele é desembrulhado para `null`.
 */
export const actionGetLatestRecord = createServerAction().handler(
  async (): Promise<MeasurementRecordResponseDTO | null> => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    try {
      const response = await apiClient<LatestRecordResponseDTO>(
        '/progress-records/latest'
      );

      return response?.latest ?? null;
    } catch (error) {
      if (error instanceof ZSAError) throw error;
      // A falha não é exibida ao usuário: o formulário a trata como "sem
      // histórico", então a mensagem é genérica de propósito.
      throw new ZSAError('ERROR', 'Erro ao carregar o último registro.');
    }
  }
);
