'use client';

import { Input } from '@/_components/ui/input';
import {
  atTargetLimit,
  filterStudents,
  TARGET_LIMIT_TEXT,
  toggleTarget,
} from '@/_lib/duplicateSelection';
import type { StudentListItem } from '@/_types/students';
import { useState } from 'react';

interface StudentChecklistProps {
  students: StudentListItem[];
  currentStudentId: string;
  selected: string[];
  onChange: (selected: string[]) => void;
}

/** Search and tick the students that receive a copy, up to the limit. */
export function StudentChecklist({
  students,
  currentStudentId,
  selected,
  onChange,
}: StudentChecklistProps) {
  const [query, setQuery] = useState('');

  return (
    <>
      <label htmlFor="duplicate-search" className="text-sm font-medium">
        Buscar aluno
      </label>
      <Input
        id="duplicate-search"
        type="search"
        value={query}
        autoComplete="off"
        onChange={event => setQuery(event.target.value)}
      />
      <ul
        aria-label="Alunos"
        className="flex max-h-64 flex-col overflow-y-auto"
      >
        {filterStudents(students, query).map(student => (
          <li key={student.id}>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(student.id)}
                disabled={
                  !selected.includes(student.id) && atTargetLimit(selected)
                }
                onChange={() => onChange(toggleTarget(selected, student.id))}
              />
              <span className="min-w-0 truncate">
                {student.name}
                {student.id === currentStudentId ? ' (este aluno)' : ''}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        {selected.length} selecionado(s). {TARGET_LIMIT_TEXT}
      </p>
    </>
  );
}
