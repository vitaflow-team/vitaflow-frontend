import { actionSignIn } from '@/_actions/singin';
import { getEnv } from '@/_lib/getenv';
import type { NextAuthOptions } from 'next-auth';
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
          picture: profile.picture ?? profile.image ?? user.picture ?? null,
        };
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
          console.log('error', mensagem);
          throw new Error(mensagem);
        });

        if (!user) {
          throw new Error('Falha ao autenticar o usuário.');
        }

        return user;
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
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name!,
        email: token.email!,
        picture: token.picture as string | null,
        accessToken: token.accessToken,
      };

      return session;
    },
  },
};
