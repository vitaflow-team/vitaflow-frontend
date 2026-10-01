'use client';

import {
  professionalDiscoveryPanelId,
  PROFESSIONAL_DISCOVERY_TAB_LABELS,
  professionalDiscoveryTabHref,
  professionalDiscoveryTabId,
  type ProfessionalDiscoveryTab,
} from '@/_lib/professionalDiscoveryTabs';
import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { useEffect, useRef, type KeyboardEvent } from 'react';

interface ProfessionalDiscoveryTabsProps {
  tabs: ProfessionalDiscoveryTab[];
  selected: ProfessionalDiscoveryTab;
}

// Real links, not buttons, mirroring ProgressTabs/SettingsTabs: the server
// renders one page per tab, so the address stays shareable.
export function ProfessionalDiscoveryTabs({
  tabs,
  selected,
}: ProfessionalDiscoveryTabsProps) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const selectedIndex = tabs.indexOf(selected);

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
      const next = (index + step + tabs.length) % tabs.length;
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
      aria-label="Seções de Buscar profissional"
      aria-orientation="horizontal"
      className="flex w-full gap-1 overflow-x-auto border-b border-line"
    >
      {tabs.map((tab, index) => {
        const isSelected = tab === selected;

        return (
          <Link
            key={tab}
            ref={element => {
              tabRefs.current[index] = element;
            }}
            id={professionalDiscoveryTabId(tab)}
            href={professionalDiscoveryTabHref(tab)}
            role="tab"
            aria-selected={isSelected}
            aria-controls={
              isSelected ? professionalDiscoveryPanelId(tab) : undefined
            }
            tabIndex={isSelected ? 0 : -1}
            onKeyDown={event => handleKeyDown(event, index)}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
              isSelected && 'border-primary font-semibold text-foreground'
            )}
          >
            {PROFESSIONAL_DISCOVERY_TAB_LABELS[tab]}
          </Link>
        );
      })}
    </div>
  );
}
