'use client';

import {
  SETTINGS_TABS,
  SETTINGS_TAB_LABELS,
  settingsPanelId,
  settingsTabHref,
  settingsTabId,
  type SettingsTab,
} from '@/_lib/settingsTabs';
import { cn } from '@/_lib/utils';
import Link from 'next/link';
import { useEffect, useRef, type KeyboardEvent } from 'react';

interface SettingsTabsProps {
  selected: SettingsTab;
}

/**
 * Abas como links de verdade (ADR-002): o servidor renderiza uma página por
 * aba, o endereço continua compartilhável e o botão Voltar funciona. O papel de
 * aba vem por cima disso, então a navegação por seta — que o navegador não dá
 * de graça para links — é feita aqui.
 *
 * Os links não carregam `checkout_session_id`: trocar de aba depois da volta do
 * Checkout não deve disparar a sincronização de novo.
 */
export function SettingsTabs({ selected }: SettingsTabsProps) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const selectedIndex = SETTINGS_TABS.indexOf(selected);

  useEffect(() => {
    const current = tabRefs.current[selectedIndex];
    if (!current) return;

    // No celular a tira rola na horizontal e a aba atual pode nascer fora da
    // vista. Quem pediu menos movimento recebe o salto direto.
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
      const next = (index + step + SETTINGS_TABS.length) % SETTINGS_TABS.length;
      tabRefs.current[next]?.focus();
      return;
    }

    // Enter já navega sozinho num link; espaço não, e o padrão de abas espera
    // que ative.
    if (event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Seções de Configurações"
      aria-orientation="horizontal"
      className="flex w-full gap-1 overflow-x-auto border-b border-line"
    >
      {SETTINGS_TABS.map((tab, index) => {
        const isSelected = tab === selected;

        return (
          <Link
            key={tab}
            ref={element => {
              tabRefs.current[index] = element;
            }}
            id={settingsTabId(tab)}
            href={settingsTabHref(tab)}
            role="tab"
            aria-selected={isSelected}
            aria-controls={isSelected ? settingsPanelId(tab) : undefined}
            tabIndex={isSelected ? 0 : -1}
            onKeyDown={event => handleKeyDown(event, index)}
            className={cn(
              // min-h-11 = 44 px de alvo de toque.
              'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
              isSelected && 'border-primary font-semibold text-foreground'
            )}
          >
            {SETTINGS_TAB_LABELS[tab]}
          </Link>
        );
      })}
    </div>
  );
}
