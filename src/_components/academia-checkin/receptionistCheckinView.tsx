'use client';

import { receptionistCheckIn } from '@/_actions/checkin/receptionistCheckIn';
import {
  searchStudents,
  type ReceptionistStudent,
} from '@/_actions/checkin/searchStudents';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { FormError } from '@/_components/students/formError';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ReceptionistCheckinView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReceptionistStudent[] | null>(null);
  const [selected, setSelected] = useState<ReceptionistStudent | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const search = useServerAction(searchStudents);
  const checkIn = useServerAction(receptionistCheckIn);

  async function runSearch() {
    setSelected(null);
    setConfirmedAt(null);
    const [data] = await search.execute({ search: query });
    setResults(data ?? []);
  }

  async function confirm() {
    if (!selected) return;
    const [result, error] = await checkIn.execute({ clientId: selected.id });
    if (!error && result) {
      setConfirmedAt(result.createdAt);
    }
  }

  function reset() {
    setSelected(null);
    setConfirmedAt(null);
    setResults(null);
    setQuery('');
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Confirmar check-in</h1>
        <p className="text-lg">{selected.name}</p>
        {confirmedAt ? (
          <>
            <p className="text-sm text-muted-foreground" role="status">
              Check-in registrado às {formatTime(confirmedAt)}.
            </p>
            <Button type="button" onClick={reset}>
              Buscar outro aluno
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={checkIn.isPending}
              onClick={() => void confirm()}
            >
              {checkIn.isPending ? 'Registrando...' : 'Confirmar check-in'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Voltar
            </Button>
          </div>
        )}
        <FormError message={checkIn.isError ? checkIn.error.message : null} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Check-in</h1>
      <div className="flex gap-2">
        <Input
          icon={Search}
          placeholder="Nome do aluno"
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
          disabled={search.isPending}
          onClick={() => void runSearch()}
        >
          Buscar
        </Button>
      </div>
      <FormError message={search.isError ? search.error.message : null} />
      {results !== null &&
        (results.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum resultado.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map(student => (
              <li key={student.id}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSelected(student)}
                >
                  {student.name}
                </Button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
