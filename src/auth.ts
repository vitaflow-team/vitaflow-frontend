import { APP_ROUTES } from '@/_constants/routes';
import { AppError } from '@/_lib/AppError';
import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { clearAccessTokenCookie } from './_lib/accessTokenCookie';
import { signInWithCredentials } from './_lib/backendSignIn';
import { clearGoogleLinkIntentCookie } from './_lib/googleLinkIntent';
import { resolveGoogleUser } from './_lib/googleProfile';
import { jwtCallback, sessionCallback, signInCallback } from './authCallbacks';

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

              // Sign-in, or the link of this Google identity to the account
              // already signed in — and a refusal the person can act on
              // comes back as a marker, not as an error (ADR-008, ADR-009).
              return await resolveGoogleUser(
                tokens.id_token,
                profile.picture ?? profile.image
              );
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
        const user = await signInWithCredentials({
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
      await clearGoogleLinkIntentCookie();
    },
  },
  callbacks: {
    signIn: params => signInCallback({ user: params.user }),
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
