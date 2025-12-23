import { APP_ROUTES } from '@/_constants/routes';
import { AppError } from '@/_lib/AppError';
import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { actionSignIn } from './_actions/users/postSignin';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
              const user = await actionSignIn({
                email: profile.email,
                password: profile.sub,
                socialLogin: true,
              }).catch(error => {
                let mensagem;
                if (error instanceof Error) {
                  mensagem = error.message;
                } else {
                  mensagem = 'Falha ao autenticar via Google';
                }
                throw new AppError(mensagem);
              });

              if (!user) {
                throw new AppError('Falha ao autenticar via Google');
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
          socialLogin: false,
        }).catch(() => {
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
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar = user.avatar ?? user.image;
        token.productId = user.productId;
        token.productGroupId = user.productGroupId;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.avatar = token.avatar;
        session.user.productId = token.productId;
        session.user.productGroupId = token.productGroupId;
        session.user.accessToken = token.accessToken;
      }

      return session;
    },
  },
});
