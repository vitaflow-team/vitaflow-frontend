import { apiClient } from '@/_lib/apiClient';

// Módulo de servidor por construção: `apiClient` lê o cookie do token pelo
// `next/headers`, que não existe no cliente. O callback de token o carrega sob
// demanda para não arrastar esse import para o bundle do middleware.

export interface PlanClaims {
  productId: string | null;
  productType: string | null;
  productGroupId: string | null;
}

interface ProfilePlanResponse {
  productId?: string | null;
  productType?: string | null;
  productGroupId?: string | null;
}

/**
 * Os claims de plano lidos da verdade do servidor. O callback de token chama
 * isto em vez de acreditar no que o cliente mandou em `update()`, que é dado
 * arbitrário (ADR-008). Só o que é claim é devolvido: nada de token de acesso.
 */
export async function fetchPlanClaims(): Promise<PlanClaims> {
  const profile = await apiClient<ProfilePlanResponse>('/profile', {
    method: 'GET',
  });

  return {
    productId: profile.productId ?? null,
    productType: profile.productType ?? null,
    productGroupId: profile.productGroupId ?? null,
  };
}
