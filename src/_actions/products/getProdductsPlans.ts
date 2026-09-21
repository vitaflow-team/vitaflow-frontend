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

/** Tipo de conta que o plano atende, como o backend devolve em `/products`. */
export type ProductTypeName = 'USER' | 'NUTRITIONIST' | 'PHYSICAL_EDUCATOR';

export interface Product {
  id: string;
  name: string;
  price: number;
  groupId: string;
  /**
   * Fonte do tipo de plano na tela de Configurações: a aba Plano descobre o
   * tipo do usuário pelo produto atual, não pela sessão, que congela no login
   * (ADR-004).
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
