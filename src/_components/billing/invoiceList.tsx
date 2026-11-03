import { buttonVariants } from '@/_components/ui/button';
import { totalPages } from '@/_lib/studentsList';
import type { Invoice } from '@/_types/billing';
import Link from 'next/link';
import { InvoiceRow } from './invoiceRow';

interface InvoiceListProps {
  items: Invoice[];
  total: number;
  page: number;
  pageSize: number;
  basePath: string;
}

interface InvoicePaginationProps {
  page: number;
  pages: number;
  basePath: string;
}

function InvoicePagination({ page, pages, basePath }: InvoicePaginationProps) {
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Páginas das cobranças"
      className="flex items-center justify-between gap-2"
    >
      {page > 1 ? (
        <Link
          href={`${basePath}?page=${page - 1}`}
          className={buttonVariants({ variant: 'outline' })}
        >
          Mais recentes
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <Link
          href={`${basePath}?page=${page + 1}`}
          className={buttonVariants({ variant: 'outline' })}
        >
          Mais antigas
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Newest competence first, as the backend already orders them (US-003, UT-124). */
export function InvoiceList({
  items,
  total,
  page,
  pageSize,
  basePath,
}: InvoiceListProps) {
  if (items.length === 0 && page === 1) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma cobrança gerada ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {items.map(invoice => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </ul>
      <InvoicePagination
        page={page}
        pages={totalPages(total, pageSize)}
        basePath={basePath}
      />
    </div>
  );
}
