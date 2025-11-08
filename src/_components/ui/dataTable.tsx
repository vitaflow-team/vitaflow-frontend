/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/_components/ui/table';
import { cn } from '@/_lib/utils';
import { Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    align?: 'left' | 'right';
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 50,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const selectColumn: ColumnDef<TData, TValue> = {
    id: 'select',
    header: ({ table }) => (
      <div className="flex w-6 items-center justify-center">
        <Checkbox
          className="bg-white"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-6 items-center justify-center">
        <Checkbox
          className="bg-white"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const settingsColumn: ColumnDef<TData, TValue> = {
    id: 'settings',
    header: ({ table }) => (
      <div className="flex justify-center content-center items-center max-w-14 w-14">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Settings2 className="size-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {table
              .getAllLeafColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                const visibleCount = table
                  .getAllLeafColumns()
                  .filter(col => col.getIsVisible()).length;

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => {
                      if (!value && visibleCount <= 1) return;
                      column.toggleVisibility(!!value);
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: () => (
      <div className="flex justify-center items-center max-w-14 w-14"></div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const visibleUserColumnsCount = columns.filter(col => {
    const colId = (col as any).id ?? (col as any).accessorKey;
    const isVisible = columnVisibility[colId] !== false;
    return isVisible;
  }).length;

  const shouldExpandSingleColumn = visibleUserColumnsCount === 1;

  const allColumns = useMemo(() => {
    const columnsWithoutSize = columns.filter(c => !c.size);
    const hasFlexibleColumns = columnsWithoutSize.length > 0;

    const modifiedColumns = columns.map(col => {
      if (col.size) return col;

      return {
        ...col,
        size: undefined,
        minSize: 100,
        maxSize: Number.MAX_SAFE_INTEGER,
        meta: {
          ...col.meta,
          grow: hasFlexibleColumns ? 1 : 0,
        },
      };
    });

    return [selectColumn, ...modifiedColumns, settingsColumn];
  }, [columns, columnVisibility]);

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnVisibility },
    onColumnVisibilityChange: updater => {
      setColumnVisibility(old => {
        const newVisibility =
          typeof updater === 'function' ? updater(old) : updater;

        const merged = { ...old, ...newVisibility };

        const getColId = (col: ColumnDef<TData, TValue>) =>
          (col as any).id ??
          (col as any).accessorKey ??
          String((col as any).header ?? '');

        const visibleCount = allColumns.reduce((count, col) => {
          const id = getColId(col);
          const isVisible = merged[id] !== undefined ? !!merged[id] : true;
          return count + (isVisible ? 1 : 0);
        }, 0);

        if (visibleCount === 2) return old;

        return merged;
      });
    },
    initialState: {
      pagination: { pageSize },
    },
  });

  return table.getRowModel().rows?.length ? (
    <div className="flex flex-col w-full max-w-full h-full">
      <div className="overflow-hidden rounded-md border w-full m-0 p-0 max-w-full  table-fixed">
        <Table className="w-full max-w-full">
          <TableHeader className="bg-secondary m-0 max-w-full table-fixed">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="flex w-full gap-2 items-center"
              >
                {headerGroup.headers.map(header => {
                  const isSettingsColumn = header.column.id === 'settings';
                  const isSelectColumn = header.column.id === 'select';

                  const alignClass =
                    header.column.columnDef.meta?.align === 'right'
                      ? 'justify-center items-center content-center text-right'
                      : 'justify-center items-center content-center text-left';

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        alignClass,
                        isSelectColumn ? 'max-w-9' : '',
                        isSettingsColumn ? 'ml-auto max-w-14 w-14' : '',
                        'overflow-hidden truncate whitespace-nowrap'
                      )}
                      style={{
                        flexGrow: header.column.columnDef.size ? 0 : 1,
                        flexBasis: header.column.columnDef.size
                          ? `${header.column.columnDef.size}px`
                          : '0',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                className="flex gap-2 w-full hover:bg-secondary/40"
              >
                {row.getVisibleCells().map(cell => {
                  const isSettingsColumn = cell.column.id === 'settings';
                  const isSelectColumn = cell.column.id === 'select';

                  const alignClass =
                    cell.column.columnDef.meta?.align === 'right'
                      ? 'justify-center items-center text-right'
                      : 'justify-center items-center text-left';

                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        alignClass,
                        isSelectColumn ? 'max-w-9' : '',
                        isSettingsColumn
                          ? 'ml-auto max-w-14 w-14 flex-none'
                          : '',
                        'overflow-hidden truncate whitespace-nowrap'
                      )}
                      style={{
                        flexGrow: cell.column.columnDef.size ? 0 : 1,
                        flexBasis: cell.column.columnDef.size
                          ? `${cell.column.columnDef.size}px`
                          : '0',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} registros selecionados.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <span>Sem resultados</span>
  );
}
