'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginByGoogle() {
  async function submitSingInGoogle() {
    try {
      await signIn('google', {
        redirect: false,
        callbackUrl: '/restrict',
      });
    } catch (error) {
      console.error('Sign in failed:', error);

      alert('Sign-in failed, please try again.');
    }
  }

  return (
    <Image
      src="/google.svg"
      className="bg-white p-2 border-2 hover:cursor-pointer"
      width={50}
      height={50}
      alt="Google"
      onClick={() => submitSingInGoogle()}
    />
  );
}
