'use client';

import {
  PLAN_CATEGORY_KEYS,
  PLAN_CATEGORY_LABELS,
  moveCategory,
  type PlanCategoryKey,
} from '@/_lib/planCategories';
import { cn } from '@/_lib/utils';
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

/** Nome acessível das sub-abas, distinto de "Seções de Configurações". */
const CONTROL_LABEL = 'Tipo de plano';

/** Ids próprios: os da tira de cima vêm de `settingsTabId` (ADR-005). */
export function planCategoryTabId(key: PlanCategoryKey): string {
  return `plan-category-tab-${key}`;
}

const PANEL_ID = 'plan-category-panel';
const SELECT_ID = 'plan-category-select';

interface PlanCategoryTabsProps {
  /** Sub-aba aberta ao entrar: a categoria do perfil (US-006.AC-2). */
  initial: PlanCategoryKey;
  /**
   * Conteúdo já montado de cada categoria. Vem pronto do servidor para que os
   * cards e seus diálogos continuem fora do pacote do cliente; a troca só
   * escolhe qual deles aparece, sem rede e sem recarregar (ADR-003).
   */
  panels: Record<PlanCategoryKey, ReactNode>;
}

/**
 * O controle secundário da aba Plano. As duas variantes existem sempre na
 * marcação e quem decide qual aparece é o CSS — `hidden sm:flex` para o
 * tablist e `sm:hidden` para o select —, de modo que não há primeira pintura
 * errada nem estado perdido ao redimensionar (ADR-005). As duas leem e
 * escrevem o mesmo `selected`.
 */
export function PlanCategoryTabs({ initial, panels }: PlanCategoryTabsProps) {
  const [selected, setSelected] = useState<PlanCategoryKey>(initial);
  const tabRefs = useRef<Partial<Record<PlanCategoryKey, HTMLButtonElement>>>(
    {}
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const next = moveCategory(selected, event.key);
    if (next === selected) return;

    // Ativação automática: a troca é instantânea, então mover o foco já
    // seleciona (ADR-005).
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div
        role="tablist"
        aria-label={CONTROL_LABEL}
        aria-orientation="horizontal"
        className="hidden sm:flex w-fit gap-1 rounded-lg border border-line bg-secondary/40 p-1"
      >
        {PLAN_CATEGORY_KEYS.map(key => {
          const isSelected = key === selected;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={planCategoryTabId(key)}
              aria-selected={isSelected}
              aria-controls={isSelected ? PANEL_ID : undefined}
              // Roving tabindex: só a sub-aba atual entra na ordem de
              // tabulação; as setas cuidam do resto (US-008.EC-1).
              tabIndex={isSelected ? 0 : -1}
              ref={element => {
                if (element) tabRefs.current[key] = element;
              }}
              onClick={() => setSelected(key)}
              onKeyDown={handleKeyDown}
              className={cn(
                // min-h-11 = 44 px de alvo de toque. A transição é
                // `motion-safe`: quem pede menos movimento não recebe
                // animação nenhuma (US-008.EC-2).
                'inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-4 text-sm font-medium text-muted-foreground motion-safe:transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
                isSelected && 'bg-background font-semibold text-foreground'
              )}
            >
              {PLAN_CATEGORY_LABELS[key]}
            </button>
          );
        })}
      </div>

      {/* Abaixo de 640 px o mesmo estado vira um select nativo: não há
          componente de select no projeto e o nativo já traz o menu do sistema
          operacional, que é o que cabe na tela estreita (ADR-005). */}
      <div className="sm:hidden flex flex-col gap-1">
        <label htmlFor={SELECT_ID} className="text-sm font-medium">
          {CONTROL_LABEL}
        </label>
        <select
          id={SELECT_ID}
          value={selected}
          onChange={event => setSelected(event.target.value as PlanCategoryKey)}
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          {PLAN_CATEGORY_KEYS.map(key => (
            <option key={key} value={key}>
              {PLAN_CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={planCategoryTabId(selected)}
        tabIndex={0}
        className="focus-visible:outline-hidden"
      >
        {panels[selected]}
      </div>
    </div>
  );
}
