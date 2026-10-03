import { cn } from '@/_lib/utils';
import { studentsHref } from '@/_lib/studentsList';
import Link from 'next/link';

interface StudentsOrderControlProps {
  order?: 'name';
  search?: string;
}

const OPTIONS = [
  { label: 'Próximo horário', order: undefined },
  { label: 'Nome', order: 'name' as const },
];

/** Two links, not a select: the order is part of the address, like the search. */
export function StudentsOrderControl({
  order,
  search,
}: StudentsOrderControlProps) {
  return (
    <nav aria-label="Ordenar alunos" className="flex flex-wrap gap-2 text-sm">
      {OPTIONS.map(option => {
        const selected = option.order === order;
        return (
          <Link
            key={option.label}
            href={studentsHref({ search, page: 1, order: option.order })}
            aria-current={selected ? 'true' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center rounded-md border border-line px-3 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
              selected
                ? 'border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {selected ? `Ordem: ${option.label}` : option.label}
          </Link>
        );
      })}
    </nav>
  );
}
