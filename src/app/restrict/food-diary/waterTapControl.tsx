'use client';

import {
  actionDecrementWater,
  actionIncrementWater,
} from '@/_actions/foodDiary/water';
import { Button } from '@/_components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface WaterTapControlProps {
  date: string;
  initialCount: number;
}

export function WaterTapControl({ date, initialCount }: WaterTapControlProps) {
  const [count, setCount] = useState(initialCount);
  const { isPending: isIncrementing, execute: increment } =
    useServerAction(actionIncrementWater);
  const { isPending: isDecrementing, execute: decrement } =
    useServerAction(actionDecrementWater);

  async function handleIncrement() {
    const [result] = await increment({ date });
    if (result) setCount(result.count);
  }

  async function handleDecrement() {
    const [result] = await decrement({ date });
    if (result) setCount(result.count);
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-lg font-semibold md:text-3xl">
        {count}
        <span className="text-xs font-normal text-muted-foreground md:text-sm">
          {' '}
          copos
        </span>
      </p>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Remover um copo de água"
          disabled={isDecrementing || count === 0}
          onClick={handleDecrement}
        >
          <Minus className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Adicionar um copo de água"
          disabled={isIncrementing}
          onClick={handleIncrement}
        >
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
