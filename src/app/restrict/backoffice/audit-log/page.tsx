import { AuditLogView } from '@/_components/backoffice/auditLogView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { redirectUnlessAdminTier } from '@/_lib/adminTierAuthorization';
import { isAuditLogLoadFailure, loadAuditLog } from '@/_lib/backofficeAuditLog';

function parsePage(value: string | undefined): number {
  if (!value || !/^\d{1,5}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Admin-interno-only audit log viewer (US-011). */
export default async function BackofficeAuditLogPage({
  searchParams,
}: PageProps) {
  await redirectUnlessAdminTier();

  const params = await searchParams;
  const page = parsePage(
    typeof params.pagina === 'string' ? params.pagina : undefined
  );

  const result = await loadAuditLog({ page });
  if (isAuditLogLoadFailure(result)) {
    redirectAccessDenied();
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registro de auditoria
        </h1>
        <p className="text-muted-foreground text-sm">
          Toda sessão &quot;ver como&quot;, de quem fez, de quem viu, por quê,
          quando começou e terminou.
        </p>
      </div>
      <AuditLogView result={result} />
    </div>
  );
}
