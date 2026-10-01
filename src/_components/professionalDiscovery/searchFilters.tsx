'use client';

import { Button } from '@/_components/ui/button';
import { Checkbox } from '@/_components/ui/checkbox';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { useProfessionalFilterNavigation } from '@/_hooks/useProfessionalFilterNavigation';
import { hasActiveFilter } from '@/_lib/professionalFilter';
import { professionalTypeLabel } from '@/_lib/professionalDisplay';
import type { ProfessionalFilter } from '@/_types/professionalFilter';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TYPE_OPTIONS = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'] as const;
const APPLY_DELAY_MS = 400;

interface SearchFiltersProps {
  filter: ProfessionalFilter;
}

/** Type, specialty, price and online filters; every active one applies at once. */
export function SearchFilters({ filter }: SearchFiltersProps) {
  const { apply, isPending } = useProfessionalFilterNavigation(filter);
  const [specialty, setSpecialty] = useState(filter.specialty ?? '');
  const [priceMax, setPriceMax] = useState(
    filter.priceMax !== undefined ? String(filter.priceMax) : ''
  );
  const specialtyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const priceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(specialtyTimer.current);
      clearTimeout(priceTimer.current);
    },
    []
  );

  function handleSpecialtyChange(value: string) {
    setSpecialty(value);
    clearTimeout(specialtyTimer.current);
    specialtyTimer.current = setTimeout(
      () => apply({ specialty: value.trim() || undefined }),
      APPLY_DELAY_MS
    );
  }

  function handlePriceChange(value: string) {
    setPriceMax(value);
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      const parsed = Number(value.replace(',', '.'));
      apply({
        priceMax: value.trim() && Number.isFinite(parsed) ? parsed : undefined,
      });
    }, APPLY_DELAY_MS);
  }

  function clearFilters() {
    setSpecialty('');
    setPriceMax('');
    apply({
      type: undefined,
      specialty: undefined,
      priceMax: undefined,
      online: undefined,
    });
  }

  return (
    <section
      aria-label="Filtros de busca"
      data-pending={isPending ? '' : undefined}
      className="grid gap-3 data-[pending]:opacity-70 md:grid-cols-[1fr_2fr_1fr_auto_auto] md:items-end"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <Label htmlFor="professional-type">Tipo</Label>
        <select
          id="professional-type"
          value={filter.type ?? ''}
          onChange={event =>
            apply({
              type: (event.target.value ||
                undefined) as ProfessionalFilter['type'],
            })
          }
          className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-base focus-visible:ring-2 focus-visible:outline-none md:text-sm"
        >
          <option value="">Todos os tipos</option>
          {TYPE_OPTIONS.map(type => (
            <option key={type} value={type}>
              {professionalTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <Label htmlFor="professional-specialty">Nome ou especialidade</Label>
        <Input
          id="professional-specialty"
          type="search"
          icon={Search}
          placeholder="Ex.: nutrição esportiva"
          maxLength={120}
          value={specialty}
          onChange={event => handleSpecialtyChange(event.target.value)}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <Label htmlFor="professional-price-max">Preço até</Label>
        <Input
          id="professional-price-max"
          type="text"
          inputMode="decimal"
          placeholder="Ex.: 200"
          value={priceMax}
          onChange={event => handlePriceChange(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 pb-2">
        <Checkbox
          id="professional-online"
          checked={filter.online ?? false}
          onCheckedChange={checked => apply({ online: checked === true })}
        />
        <Label htmlFor="professional-online">Atende online</Label>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={!hasActiveFilter(filter)}
        onClick={clearFilters}
      >
        Limpar filtros
      </Button>
    </section>
  );
}
