'use client';

import { manualEnrollTurma } from '@/_actions/academia/turmas/manualEnrollTurma';
import { searchAcademiaAlunos } from '@/_actions/academia/turmas/searchAcademiaAlunos';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Input } from '@/_components/ui/input';
import { FormError } from '@/_components/students/formError';
import type { AcademiaStudentListItem } from '@/_types/academiaAlunos';
import { Search, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface ManualEnrollPanelProps {
  turmaId: string;
}

export function ManualEnrollPanel({ turmaId }: ManualEnrollPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AcademiaStudentListItem[]>([]);
  const search = useServerAction(searchAcademiaAlunos);
  const enroll = useServerAction(manualEnrollTurma);

  async function runSearch() {
    if (!query.trim()) return;
    const [data] = await search.execute({ search: query });
    setResults(data?.items ?? []);
  }

  async function pick(clientId: string) {
    const [, error] = await enroll.execute({ turmaId, clientId });
    if (!error) {
      setOpen(false);
      setQuery('');
      setResults([]);
      router.refresh();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen);
        if (!isOpen) {
          setQuery('');
          setResults([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus aria-hidden="true" />
          Inscrever aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscrever aluno manualmente</DialogTitle>
          <DialogDescription>
            Busque um aluno desta academia pelo nome ou e-mail.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            icon={Search}
            placeholder="Nome ou e-mail"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void runSearch();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={search.isPending}
            onClick={() => void runSearch()}
          >
            Buscar
          </Button>
        </div>
        <FormError
          message={
            search.isError
              ? search.error.message
              : enroll.isError
                ? enroll.error.message
                : null
          }
        />
        {results.length > 0 && (
          <ul className="flex flex-col gap-1">
            {results.map(item => (
              <li key={item.id}>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start"
                  disabled={enroll.isPending}
                  onClick={() => void pick(item.id)}
                >
                  {item.name}
                  <span className="text-muted-foreground text-sm">
                    {item.email}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
