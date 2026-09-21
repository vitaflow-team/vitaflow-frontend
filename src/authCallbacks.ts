import type { Session, User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';

export async function jwtCallback({
  token,
  user,
  trigger,
}: {
  token: JWT;
  user?: User | AdapterUser | null;
  trigger?: 'signIn' | 'signUp' | 'update';
  /**
   * O que o cliente mandou em `update(data)`. Declarado para documentar que
   * existe e é ignorado de propósito: seria a porta para um usuário escrever o
   * próprio tipo de plano no token (ADR-008).
   */
  session?: unknown;
}) {
  if (user) {
    const authUser = user as User;
    token.id = authUser.id;
    token.name = authUser.name;
    token.email = authUser.email;
    token.avatar = authUser.avatar ?? authUser.image;
    token.productId = authUser.productId;
    token.productGroupId = authUser.productGroupId;
    token.productType = authUser.productType;
  }

  if (trigger === 'update') {
    try {
      // Import sob demanda: o helper depende de `next/headers` e só vale no
      // servidor, enquanto este callback também é carregado pelo middleware.
      const { fetchPlanClaims } = await import('@/_lib/fetchPlanClaims');
      const claims = await fetchPlanClaims();

      token.productId = claims.productId;
      token.productType = claims.productType;
      token.productGroupId = claims.productGroupId;
    } catch (error) {
      // Perfil indisponível mantém os claims anteriores: uma sessão levemente
      // velha é melhor do que derrubar o usuário ou zerar o acesso.
      console.error('Falha ao atualizar o plano da sessão:', error);
    }
  }

  return token;
}

export async function sessionCallback({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) {
  if (token && session.user) {
    session.user.id = token.id;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.avatar = token.avatar;
    session.user.productId = token.productId;
    session.user.productGroupId = token.productGroupId;
    session.user.productType = token.productType;
  }

  return session;
}
