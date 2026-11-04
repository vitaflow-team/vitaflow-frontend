import { DataTable } from '@/_components/ui/dataTable';
import { appLabel, formatMoment } from '@/_lib/errorMonitoringDisplay';
import type { ErrorMonitoringListItem } from '@/_types/errorMonitoringListItem';
import type { ErrorMonitoringListResult } from '@/_types/errorMonitoringListResult';
import type { ColumnDef } from '@tanstack/react-table';

interface ErrorMonitoringViewProps {
  result: ErrorMonitoringListResult | null;
  /** Backend unreachable (`sentry_unavailable`) — distinct from an empty list (US-001.EC-4). */
  failed: boolean;
}

const columns: ColumnDef<ErrorMonitoringListItem>[] = [
  {
    accessorKey: 'app',
    header: 'App',
    size: 140,
    meta: { mobile: true },
    cell: ({ row }) => <div>{appLabel(row.getValue('app'))}</div>,
  },
  {
    accessorKey: 'title',
    header: 'Resumo',
    meta: { mobile: true },
    cell: ({ row }) => <div>{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'firstSeen',
    header: 'Primeira ocorrência',
    size: 170,
    meta: { mobile: false },
    cell: ({ row }) => <div>{formatMoment(row.getValue('firstSeen'))}</div>,
  },
  {
    accessorKey: 'lastSeen',
    header: 'Última ocorrência',
    size: 170,
    meta: { mobile: false },
    cell: ({ row }) => <div>{formatMoment(row.getValue('lastSeen'))}</div>,
  },
  {
    accessorKey: 'count',
    header: 'Ocorrências',
    size: 120,
    meta: { align: 'right', mobile: true },
    cell: ({ row }) => <div>{row.getValue('count')}</div>,
  },
];

/** Read-only error list, admin-tier only (US-001, ADR-001). */
export function ErrorMonitoringView({
  result,
  failed,
}: ErrorMonitoringViewProps) {
  if (failed) {
    return (
      <p role="alert" className="text-destructive py-8 text-center text-sm">
        Não foi possível carregar os erros agora. Tente novamente em alguns
        instantes.
      </p>
    );
  }

  const items = result?.items ?? [];

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhum erro inesperado registrado no período.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={items}
      getEditLink={row =>
        `/restrict/backoffice/error-monitoring/${row.app}/${row.id}`
      }
    />
  );
}
