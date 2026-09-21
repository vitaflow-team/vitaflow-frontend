'use client';

import { getBottomNavItems, isRouteActive } from '@/_lib/navigation';
import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  productType?: string | null;
}

export function BottomNav({ productType }: BottomNavProps) {
  const pathname = usePathname();
  const items = getBottomNavItems(productType);

  return (
    // Rótulo próprio, distinto do menu lateral: são dois marcos de navegação e
    // um leitor de tela precisa saber qual é qual.
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex items-stretch justify-around">
        {items.map(item => {
          const active = isRouteActive(pathname, item.url);

          return (
            <li key={item.url} className="flex-1">
              <Link
                href={item.url}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  // 48 px de alvo mínimo, com rótulo sempre visível.
                  'flex min-h-12 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[0.6875rem] border-t-2 border-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
                  active && 'border-primary font-semibold'
                )}
              >
                <item.icon className="size-5" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
