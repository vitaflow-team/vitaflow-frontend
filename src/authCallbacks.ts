import type { Session, User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';

export async function jwtCallback({
  token,
  user,
}: {
  token: JWT;
  user?: User | AdapterUser | null;
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
