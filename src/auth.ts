import { APP_ROUTES } from '@/_constants/routes';
import { AppError } from '@/_lib/AppError';
import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import {
  actionSignIn,
  actionSignInWithGoogle,
} from './_actions/users/postSignin';
import { clearAccessTokenCookie } from './_lib/accessTokenCookie';
import { jwtCallback, sessionCallback } from './authCallbacks';

// `unstable_update` é o único caminho de atualização de sessão do servidor no
// NextAuth v5 beta; ele escreve o cookie, então só roda em server action ou
// route handler (ADR-008).
export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile, tokens) {
              if (!tokens.id_token) {
                throw new AppError('Falha ao autenticar via Google.');
              }

              const user = await actionSignInWithGoogle(tokens.id_token).catch(
                () => {
                  throw new AppError('Falha ao autenticar via Google.');
                }
              );

              if (!user) {
                throw new AppError('Falha ao autenticar via Google.');
              }

              return {
                ...user,
                avatar:
                  profile.picture ?? profile.image ?? user.avatar ?? undefined,
              } as User;
            },
          }),
        ]
      : []),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Seu email' },
        password: {
          label: 'Senha',
          type: 'password',
          placeholder: 'Sua senha',
        },
      },
      async authorize(credentials) {
        const user = await actionSignIn({
          email: credentials!.email as string,
          password: credentials!.password as string,
        }).catch(error => {
          console.error('Authorize error:', error);
          return null;
        });

        if (!user) {
          return null;
        }

        return { ...user } as User;
      },
    }),
  ],
  session: {
    maxAge: 60 * 60, // 1 hora
    strategy: 'jwt',
  },
  pages: {
    signIn: APP_ROUTES.SIGN_IN,
    signOut: APP_ROUTES.HOME,
    error: APP_ROUTES.HOME,
  },
  events: {
    async signOut() {
      await clearAccessTokenCookie();
    },
  },
  callbacks: {
    jwt: params =>
      jwtCallback({
        token: params.token,
        user: params.user,
        trigger: params.trigger,
        session: params.session,
      }),
    session: params =>
      sessionCallback({ session: params.session, token: params.token }),
  },
});
