'use client';

import {
  progressPanelId,
  PROGRESS_TABS,
  PROGRESS_TAB_LABELS,
  progressTabHref,
  progressTabId,
  type ProgressTab,
} from '@/_lib/progressTabs';
import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { useEffect, useRef, type KeyboardEvent } from 'react';

interface ProgressTabsProps {
  selected: ProgressTab;
}

// Real links, not buttons: the server renders one page per tab, the address
// stays shareable and the Back button works. Arrow-key roving-tabindex
// navigation is added on top since the browser doesn't give it to links for
// free, mirroring SettingsTabs.
export function ProgressTabs({ selected }: ProgressTabsProps) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const selectedIndex = PROGRESS_TABS.indexOf(selected);

  useEffect(() => {
    const current = tabRefs.current[selectedIndex];
    if (!current) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    current.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [selectedIndex]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = (index + step + PROGRESS_TABS.length) % PROGRESS_TABS.length;
      tabRefs.current[next]?.focus();
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Seções de Minha evolução"
      aria-orientation="horizontal"
      className="flex w-full gap-1 overflow-x-auto border-b border-line"
    >
      {PROGRESS_TABS.map((tab, index) => {
        const isSelected = tab === selected;

        return (
          <Link
            key={tab}
            ref={element => {
              tabRefs.current[index] = element;
            }}
            id={progressTabId(tab)}
            href={progressTabHref(tab)}
            role="tab"
            aria-selected={isSelected}
            aria-controls={isSelected ? progressPanelId(tab) : undefined}
            tabIndex={isSelected ? 0 : -1}
            onKeyDown={event => handleKeyDown(event, index)}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
              isSelected && 'border-primary font-semibold text-foreground'
            )}
          >
            {PROGRESS_TAB_LABELS[tab]}
          </Link>
        );
      })}
    </div>
  );
}
