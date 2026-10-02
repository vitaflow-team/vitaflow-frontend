'use client';

import { actionBookSlot } from '@/_actions/scheduling/bookSlot';
import { actionListOpenSlots } from '@/_actions/scheduling/listOpenSlots';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group';
import type { SessionType, Slot } from '@/_types/scheduling';
import { useEffect, useState } from 'react';
import { useServerAction } from 'zsa-react';

interface SlotPickerProps {
  professionalId: string;
  professionalName: string;
}

function todayInBrt(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
}

// The full BRT calendar day for the chosen date, expressed with an explicit
// offset so it matches the backend's own BRT-anchored slot generation
// regardless of the viewer's own browser timezone.
function brtDayRange(dateStr: string): { from: string; to: string } {
  return {
    from: `${dateStr}T00:00:00-03:00`,
    to: `${dateStr}T23:59:59-03:00`,
  };
}

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** US-005/US-006: pick a day, see open slots, book one instantly — no
 * waiting state (ADR-002). A lost race (US-006.EC-1) refreshes the list. */
export function SlotPicker({
  professionalId,
  professionalName,
}: SlotPickerProps) {
  const [date, setDate] = useState(todayInBrt());
  const [type, setType] = useState<SessionType>('PRESENCIAL');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [bookError, setBookError] = useState<string>();
  const [confirmedSlotId, setConfirmedSlotId] = useState<string>();
  const { isPending, execute } = useServerAction(actionBookSlot);

  async function refresh() {
    setLoading(true);
    setLoadError(undefined);
    const { from, to } = brtDayRange(date);
    const [result, error] = await actionListOpenSlots({
      professionalId,
      from,
      to,
    });
    if (error) {
      setLoadError(error.message);
    } else {
      setSlots(result ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
    setConfirmedSlotId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function book(slotId: string) {
    setBookError(undefined);
    const [result, error] = await execute({ slotId, type });
    if (error) {
      setBookError(error.message);
      // US-006.EC-1: the slot was just taken — refresh so the list never
      // shows a stale, already-unavailable slot.
      await refresh();
      return;
    }
    if (result) {
      setConfirmedSlotId(result.id);
      setSlots(current => current.filter(slot => slot.id !== slotId));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="scheduling-date">Dia</Label>
        <Input
          id="scheduling-date"
          type="date"
          value={date}
          min={todayInBrt()}
          onChange={event => setDate(event.target.value)}
          className="w-fit"
        />
      </div>

      <RadioGroup
        value={type}
        onValueChange={value => setType(value as SessionType)}
        className="flex flex-row gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="PRESENCIAL" id="type-presencial" />
          <Label htmlFor="type-presencial">Presencial</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="ONLINE" id="type-online" />
          <Label htmlFor="type-online">Online</Label>
        </div>
      </RadioGroup>

      {confirmedSlotId && (
        <p className="text-sm text-green-700 dark:text-green-500">
          Horário confirmado com {professionalName}!
        </p>
      )}
      {bookError && <p className="text-sm text-destructive">{bookError}</p>}
      {loadError && <p className="text-sm text-destructive">{loadError}</p>}

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando horários...</p>
      ) : slots.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum horário disponível neste dia.
        </p>
      ) : (
        <ul aria-label="Horários disponíveis" className="flex flex-wrap gap-2">
          {slots.map(slot => (
            <li key={slot.id}>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => void book(slot.id)}
              >
                {formatSlotTime(slot.startAt)}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
