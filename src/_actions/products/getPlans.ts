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

/** Account type the plan serves, as the backend returns it from `/plans`. */
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

/** One message only: the failure reason belongs in the log, not on screen (ADR-003). */
const LOAD_ERROR = 'Não foi possível carregar os planos.';

/**
 * The whole catalog as one flat list, already sorted by price and name by the
 * backend. The Plan tab loads it once and filters by category in memory,
 * without calling again on every sub-tab switch (ADR-003). The catalog is
 * public and changes rarely, so it is cached for an hour.
 */
export const actionGetPlans = createServerAction().handler(async () => {
  try {
    return await apiClient<Product[]>('/plans', {
      method: 'GET',
      cache: 'force-cache',
      next: { revalidate: 3600, tags: ['plans'] },
    });
  } catch {
    throw new ZSAError('ERROR', LOAD_ERROR);
  }
});
