'use client';

import { APP_ROUTES } from '@/_constants/routes';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginByGoogle() {
  async function submitSignInGoogle() {
    await signIn('google', {
      redirect: true,
      callbackUrl: APP_ROUTES.ROUTE_PRIVATE,
    });
  }

  return (
    <button
      type="button"
      onClick={() => submitSignInGoogle()}
      aria-label="Continuar com o Google"
      className="bg-white p-2 border-2 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Image src="/google.svg" width={50} height={50} alt="" />
    </button>
  );
}
