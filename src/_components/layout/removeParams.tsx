'use client';

import { useEffect } from 'react';

interface RemoveParamsProps {
  children: React.ReactNode;
}

export const RemoveParams = ({ children }: RemoveParamsProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;

      try {
        const urlObject = new URL(currentUrl);

        if (urlObject.search) {
          const newUrlWithoutParams = urlObject.origin + urlObject.pathname;

          window.history.replaceState({}, '', newUrlWithoutParams);
        }
      } catch (e) {}
    }
  }, []);

  return <>{children}</>;
};
