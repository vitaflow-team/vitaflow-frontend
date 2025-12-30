'use client';

import { useRouter } from 'next/navigation';

export function useFormRedirect(redirectUrl: string) {
  const router = useRouter();

  const onSuccess = () => {
    router.push(redirectUrl);
  };

  return {
    onSuccess,
    backUrl: redirectUrl,
  };
}
