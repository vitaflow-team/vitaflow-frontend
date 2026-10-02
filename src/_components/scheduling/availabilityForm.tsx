'use client';

import { actionPublishAvailability } from '@/_actions/scheduling/publishAvailability';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

const DAY_OPTIONS = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

const DURATION_OPTIONS = [30, 45, 60, 90];

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** US-001: publish a recurring weekly window; slots generate automatically. */
export function AvailabilityForm() {
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(45);
  const [error, setError] = useState<string>();
  const { isPending, execute } = useServerAction(actionPublishAvailability);
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    const [, actionError] = await execute({
      dayOfWeek,
      startMinute: toMinutes(startTime),
      endMinute: toMinutes(endTime),
      sessionDurationMinutes,
    });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="availability-day">Dia da semana</Label>
        <select
          id="availability-day"
          value={dayOfWeek}
          onChange={event => setDayOfWeek(Number(event.target.value))}
          className="border-input bg-background focus-visible:ring-ring h-10 rounded-md border px-3 text-base focus-visible:ring-2 focus-visible:outline-none md:text-sm"
        >
          {DAY_OPTIONS.map(day => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="availability-start">Início</Label>
        <Input
          id="availability-start"
          type="time"
          value={startTime}
          onChange={event => setStartTime(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="availability-end">Fim</Label>
        <Input
          id="availability-end"
          type="time"
          value={endTime}
          onChange={event => setEndTime(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="availability-duration">Duração (min)</Label>
        <select
          id="availability-duration"
          value={sessionDurationMinutes}
          onChange={event =>
            setSessionDurationMinutes(Number(event.target.value))
          }
          className="border-input bg-background focus-visible:ring-ring h-10 rounded-md border px-3 text-base focus-visible:ring-2 focus-visible:outline-none md:text-sm"
        >
          {DURATION_OPTIONS.map(duration => (
            <option key={duration} value={duration}>
              {duration}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending}>
        Publicar horário
      </Button>

      {error && <p className="text-destructive w-full text-sm">{error}</p>}
    </form>
  );
}
