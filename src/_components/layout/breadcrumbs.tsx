import type { TopbarContext } from '@/_lib/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbsProps {
  items: Extract<TopbarContext, { kind: 'trail' }>['items'];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1"
            >
              {index > 0 && (
                <ChevronRight
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
                >
                  {item.label}
                </Link>
              ) : (
                // O último item é a página atual: nunca um link, e marcado como
                // atual para quem navega por leitor de tela.
                <span aria-current="page" className="font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
