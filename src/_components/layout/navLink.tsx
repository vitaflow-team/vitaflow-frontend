'use client';

import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  url: string;
  children?: ReactNode;
  exact?: boolean;
}

export function NavLink({ url, children, exact = false }: NavLinkProps) {
  const activePath = usePathname();

  const isActive = (() => {
    if (!activePath) return false;

    if (url === '/') return activePath === '/';

    if (exact) {
      return activePath === url;
    }

    const normalize = (s: string) => (s.endsWith('/') ? s.slice(0, -1) : s);
    const p = normalize(activePath);
    const u = normalize(url);

    return p === u || p.startsWith(u + '/');
  })();

  return (
    <Link
      className={cn(
        'px-2 py-1 md:px-4 md:py-2',
        'border-primary text-sm lg:text-base',
        'hover:bg-primary hover:text-white',
        isActive ? 'font-bold border-b-2 text-primary' : 'border-b-0'
      )}
      href={url}
    >
      {children}
    </Link>
  );
}
