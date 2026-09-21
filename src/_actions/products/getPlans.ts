'use server';

import { apiClient } from '@/_lib/apiClient';
import { createServerAction, ZSAError } from 'zsa';

export interface ProductInfo {
  id: string;
  description: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

/** Tipo de conta que o plano atende, como o backend devolve em `/plans`. */
export type ProductTypeName = 'USER' | 'NUTRITIONIST' | 'PHYSICAL_EDUCATOR';

export interface Product {
  id: string;
  name: string;
  price: number;
  groupId: string;
  type: ProductTypeName;
  stripeId: string | null;
  createdAt: string;
  updatedAt: string;
  productInfos: ProductInfo[];
}

/** Mensagem única: o motivo da falha é do log, não da tela (ADR-003). */
const LOAD_ERROR = 'Não foi possível carregar os planos.';

/**
 * O catálogo inteiro em uma lista plana, já ordenado por preço e nome pelo
 * backend. A aba Plano carrega uma vez e filtra por categoria em memória, sem
 * refazer a chamada a cada troca de sub-aba (ADR-003).
 */
export const actionGetPlans = createServerAction().handler(async () => {
  try {
    return await apiClient<Product[]>('/plans', { method: 'GET' });
  } catch {
    throw new ZSAError('ERROR', LOAD_ERROR);
  }
});
