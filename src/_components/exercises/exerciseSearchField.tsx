'use client';

import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';

const SEARCH_DELAY_MS = 400;

interface ExerciseSearchFieldProps {
  /** The search currently applied (from the address bar). */
  value: string;
  onSearch: (term: string) => void;
}

/**
 * Searches as the user types, once typing pauses; Enter searches at once.
 * When the applied search changes from outside (clearing the filters), the
 * field follows it.
 */
export function ExerciseSearchField({
  value,
  onSearch,
}: ExerciseSearchFieldProps) {
  const [term, setTerm] = useState(value);
  const [applied, setApplied] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (value !== applied) {
    setApplied(value);
    if (term.trim() !== value) setTerm(value);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(next: string) {
    setTerm(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next), SEARCH_DELAY_MS);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearTimeout(timer.current);
    onSearch(term);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex flex-col gap-1">
      <Label htmlFor="exercise-search">Buscar por nome</Label>
      <Input
        id="exercise-search"
        type="search"
        icon={Search}
        placeholder="Ex.: supino, agachamento"
        maxLength={120}
        value={term}
        onChange={event => handleChange(event.target.value)}
      />
    </form>
  );
}
