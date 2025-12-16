'use client';

import { APP_ROUTES } from '@/_constants/routes';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginByGoogle() {
  async function submitSignInGoogle() {
    await signIn('google', {
      redirect: true,
      callbackUrl: APP_ROUTES.PRIVATE.DASHBOARD,
    });
  }

  return (
    <Image
      src="/google.svg"
      className="bg-white p-2 border-2 hover:cursor-pointer"
      width={50}
      height={50}
      alt="Google"
      onClick={() => submitSignInGoogle()}
    />
  );
}
