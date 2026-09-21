/**
 * A sessão congela o plano no login, então ela fica velha sempre que o perfil
 * (verdade do servidor) aponta para outro produto — troca de plano, webhook ou
 * cancelamento que chegou ao fim. É daqui que a tela de Configurações decide
 * pedir um `update()` (ADR-008).
 */
export function isSessionPlanStale(
  session: { productId?: string | null },
  profile: { productId?: string | null }
): boolean {
  return (session.productId ?? null) !== (profile.productId ?? null);
}
