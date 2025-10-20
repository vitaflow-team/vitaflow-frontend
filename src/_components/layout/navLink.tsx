'use client';

import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  url: string;
  children?: ReactNode;
}

export function NavLink({ url, children }: NavLinkProps) {
  const activePath = usePathname();

  return (
    <Link
      className={cn(
        'px-2 py-1 md:px-4 md:py-2',
        'border-primary text-sm lg:text-base',
        'hover:bg-primary hover:text-white',
        activePath === url ? 'font-bold border-b-2 text-primary' : 'border-b-0'
      )}
      href={url}
    >
      {children}
    </Link>
  );
}
