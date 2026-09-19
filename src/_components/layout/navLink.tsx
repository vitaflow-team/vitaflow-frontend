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
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'px-3 py-2 rounded-md',
        'border-primary text-sm lg:text-base transition-colors',
        'hover:bg-primary hover:text-primary-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive ? 'font-bold bg-secondary text-primary' : ''
      )}
      href={url}
    >
      {children}
    </Link>
  );
}
