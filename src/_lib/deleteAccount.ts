/**
 * Contas criadas pelo Google não têm senha, então a confirmação da exclusão é
 * o próprio e-mail digitado (ADR-007). A comparação ignora maiúsculas e
 * espaços nas pontas — quem copia o e-mail de outro lugar costuma trazer um
 * espaço junto —, mas nada além disso: texto extra no meio ou no fim não vale.
 */
export function isDeletionConfirmed(typed: string, email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return false;
  }

  return typed.trim().toLowerCase() === normalizedEmail;
}
