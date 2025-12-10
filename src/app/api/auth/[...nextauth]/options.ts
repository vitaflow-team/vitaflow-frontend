import { actionSignIn } from '@/_actions/singin';
import { getEnv } from '@/_lib/getenv';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
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
          throw new Error(mensagem);
        });

        if (!user) {
          throw new Error('Falha ao autenticar via Google');
        }

        return {
          ...user,
          avatar: profile.picture ?? profile.image ?? user.avatar ?? undefined,
        } as User;
      },
    }),
    CredentialsProvider({
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
          email: credentials!.email,
          password: credentials!.password,
          socialLogin: false,
        }).catch(error => {
          let mensagem;
          if (error instanceof Error) {
            mensagem = error.message;
          } else {
            mensagem = 'Falha ao autenticar o usuário.';
          }
          throw new Error(mensagem);
        });

        if (!user) {
          throw new Error('Falha ao autenticar o usuário.');
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
    signIn: '/singin',
    signOut: '/',
    error: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name!,
        email: token.email!,
        avatar: token.avatar,
        accessToken: token.accessToken,
      };

      return session;
    },
  },
};
