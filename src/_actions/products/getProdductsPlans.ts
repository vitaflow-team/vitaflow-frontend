'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { createServerAction } from 'zsa';

interface ProductInfo {
  id: string;
  description: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

/** Account type the plan serves, as the backend returns it from `/products`. */
export type ProductTypeName = 'USER' | 'NUTRITIONIST' | 'PHYSICAL_EDUCATOR';

export interface Product {
  id: string;
  name: string;
  price: number;
  groupId: string;
  /**
   * Source of the plan type on the Settings screen: the Plan tab finds the
   * user's type from the current product, not from the session, which freezes
   * at sign-in (ADR-004).
   */
  type: ProductTypeName;
  stripeId: string | null;
  createdAt: string;
  updatedAt: string;
  productInfos: ProductInfo[];
}

export interface ProductsPlan {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

/** The public plan catalog, grouped by plan; cached for an hour. */
export const actionGetProductsPlans = createServerAction().handler(async () => {
  try {
    const productsPlans = await apiClient<ProductsPlan[]>('/products', {
      method: 'GET',
      cache: 'force-cache',
      next: { revalidate: 3600, tags: ['plans'] },
    });
    return productsPlans;
  } catch (error) {
    throw toSafeActionError('getProductsPlans', error);
  }
});
