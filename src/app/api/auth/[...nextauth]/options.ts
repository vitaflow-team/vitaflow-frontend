import { getEnv } from '@/_lib/getenv';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const userCredential = {
          password: credentials?.password,
          email: credentials?.email,
        };

        if (
          userCredential.email === 'fcvicari@gmail.com' &&
          userCredential.password === '12345678'
        ) {
          return {
            id: '1',
            name: 'Fulano de Tal',
            email: 'fcvicari@gmail.com',
          };
        }

        return null;
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
      const jwtReturn = {
        ...token,
        ...user,
      };

      return jwtReturn;
    },

    async session({ session, token }) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      session.user = token as any;

      return session;
    },
  },
};
