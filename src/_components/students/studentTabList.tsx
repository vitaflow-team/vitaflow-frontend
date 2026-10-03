'use client';

import {
  STUDENT_TABS,
  STUDENT_TAB_LABELS,
  studentPanelId,
  studentTabHref,
  studentTabId,
  type StudentTab,
} from '@/_lib/studentsTabs';
import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { useRef, type KeyboardEvent } from 'react';

interface StudentTabListProps {
  studentId: string;
  selected: StudentTab;
}

// Real links, so each tab is its own address and Back works; arrow keys move
// between them like a tab list, since links do not give that for free.
export function StudentTabList({ studentId, selected }: StudentTabListProps) {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>, at: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = (at + step + STUDENT_TABS.length) % STUDENT_TABS.length;
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Seções do aluno"
      className="flex w-full gap-1 overflow-x-auto border-b border-line"
    >
      {STUDENT_TABS.map((tab, index) => (
        <Link
          key={tab}
          ref={element => {
            refs.current[index] = element;
          }}
          id={studentTabId(tab)}
          href={studentTabHref(studentId, tab)}
          role="tab"
          aria-selected={tab === selected}
          aria-controls={tab === selected ? studentPanelId(tab) : undefined}
          tabIndex={tab === selected ? 0 : -1}
          onKeyDown={event => handleKeyDown(event, index)}
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
            tab === selected && 'border-primary font-semibold text-foreground'
          )}
        >
          {STUDENT_TAB_LABELS[tab]}
        </Link>
      ))}
    </div>
  );
}
