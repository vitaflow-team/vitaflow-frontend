'use client';

import { Input } from '@/_components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/_components/ui/tabs';
import type {
  DirectoryKind,
  DirectoryListResult,
  DirectoryResultItem,
  DirectoryTypeFilter,
} from '@/_types/backofficeDirectory';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ViewAsReasonDialog } from './viewAsReasonDialog';

const KIND_LABELS: Record<DirectoryKind, string> = {
  USER: 'Usuário',
  NUTRITIONIST: 'Nutricionista',
  PHYSICAL_EDUCATOR: 'Educador físico',
  ACADEMIA_OWNER: 'Academia',
  ACADEMIA_RECEPTIONIST: 'Recepcionista',
};

const TYPE_TABS: { value: DirectoryTypeFilter | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'USER', label: 'Usuário' },
  { value: 'NUTRITIONIST', label: 'Nutricionista' },
  { value: 'PHYSICAL_EDUCATOR', label: 'Educador físico' },
  { value: 'ACADEMIA', label: 'Academia' },
];

function DirectoryResultRow({ item }: { item: DirectoryResultItem }) {
  return (
    <li className="flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{item.name}</span>
        <span className="text-muted-foreground truncate text-sm">
          {item.email}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">
          {KIND_LABELS[item.kind]}
        </span>
        <ViewAsReasonDialog
          targetKind={
            item.kind === 'ACADEMIA_RECEPTIONIST' ? 'ACADEMIA_STAFF' : 'USER'
          }
          targetId={item.id}
          targetLabel={`${item.name} (${KIND_LABELS[item.kind]})`}
        />
      </div>
    </li>
  );
}

interface DirectorySearchFormProps {
  initialTerm: string;
  onSearch: (term: string) => void;
}

function DirectorySearchForm({
  initialTerm,
  onSearch,
}: DirectorySearchFormProps) {
  const [term, setTerm] = useState(initialTerm);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSearch(term.trim());
      }}
      className="flex gap-2"
    >
      <Input
        value={term}
        onChange={event => setTerm(event.target.value)}
        placeholder="Nome ou e-mail"
        aria-label="Buscar conta"
      />
    </form>
  );
}

interface DirectoryTypeTabsProps {
  type: DirectoryTypeFilter | undefined;
  onChange: (type: DirectoryTypeFilter | '') => void;
}

function DirectoryTypeTabs({ type, onChange }: DirectoryTypeTabsProps) {
  return (
    <Tabs
      value={type ?? 'ALL'}
      onValueChange={value =>
        onChange(value === 'ALL' ? '' : (value as DirectoryTypeFilter))
      }
    >
      <TabsList>
        {TYPE_TABS.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function DirectoryResultsList({ items }: { items: DirectoryResultItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhuma conta encontrada.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-md border">
      {items.map(item => (
        <DirectoryResultRow key={item.id} item={item} />
      ))}
    </ul>
  );
}

interface AccountDirectoryViewProps {
  result: DirectoryListResult;
  search?: string;
  type?: DirectoryTypeFilter;
}

export function AccountDirectoryView({
  result,
  search,
  type,
}: AccountDirectoryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(next: { busca?: string; tipo?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.busca !== undefined) {
      if (next.busca) params.set('busca', next.busca);
      else params.delete('busca');
    }
    if (next.tipo !== undefined) {
      if (next.tipo) params.set('tipo', next.tipo);
      else params.delete('tipo');
    }
    params.delete('pagina');
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DirectorySearchForm
        initialTerm={search ?? ''}
        onSearch={busca => navigate({ busca })}
      />
      <DirectoryTypeTabs type={type} onChange={tipo => navigate({ tipo })} />
      <DirectoryResultsList items={result.items} />
    </div>
  );
}
