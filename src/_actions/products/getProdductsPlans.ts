'use server';

import { apiClient } from '@/_lib/apiClient';
import { createServerAction, ZSAError } from 'zsa';

interface ProductInfo {
  id: string;
  description: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  groupId: string;
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

export const actionGetProductsPlans = createServerAction().handler(async () => {
  try {
    const productsPlans = await apiClient<ProductsPlan[]>('/products', {
      method: 'GET',
    });
    return productsPlans;
  } catch (error) {
    if (error instanceof Error) {
      throw new ZSAError('ERROR', error.message);
    }
    throw new ZSAError('ERROR', 'Erro ao buscar produtos e planos.');
  }
});
