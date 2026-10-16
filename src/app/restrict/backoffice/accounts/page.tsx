import { AccountDirectoryView } from '@/_components/backoffice/accountDirectoryView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import {
  isDirectoryLoadFailure,
  loadDirectory,
} from '@/_lib/backofficeDirectory';
import type { DirectoryTypeFilter } from '@/_types/backofficeDirectory';

const TYPE_VALUES: DirectoryTypeFilter[] = [
  'USER',
  'NUTRITIONIST',
  'PHYSICAL_EDUCATOR',
  'ACADEMIA',
];

function parseType(value: string | undefined): DirectoryTypeFilter | undefined {
  return TYPE_VALUES.find(type => type === value);
}

function parsePage(value: string | undefined): number {
  if (!value || !/^\d{1,5}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** The backoffice account directory (US-001, US-002, US-013, US-014). */
export default async function BackofficeAccountsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const search =
    typeof params.busca === 'string' ? params.busca.trim() : undefined;
  const type = parseType(
    typeof params.tipo === 'string' ? params.tipo : undefined
  );
  const page = parsePage(
    typeof params.pagina === 'string' ? params.pagina : undefined
  );

  const result = await loadDirectory({ search, type, page });
  if (isDirectoryLoadFailure(result)) {
    redirectAccessDenied();
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Diretório de contas
        </h1>
        <p className="text-muted-foreground text-sm">
          Busque qualquer conta da plataforma e inicie uma sessão “ver como”.
        </p>
      </div>
      <AccountDirectoryView result={result} search={search} type={type} />
    </div>
  );
}
