import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

import { Check } from 'lucide-react';
import Image from 'next/image';
import { UpgradeCheckout } from './upgradeCheckout';

interface UpgradeCardItemProps {
  label: string;
}

export function UpgradeCardItem({ label }: UpgradeCardItemProps) {
  return (
    <div className="flex flex-row gap-2 w-full text-sm">
      <div>
        <Check className="text-primary size-5" />
      </div>
      <span>{label}</span>
    </div>
  );
}

interface UpgradeCardProps {
  title: string;
  value?: number;
  active?: boolean;
  information?: boolean;
  productId?: string;
  itens?: string[];
}

export function UpgradeCard({
  title,
  value = 0,
  active = false,
  information = false,
  itens,
  productId,
}: UpgradeCardProps) {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Card className="relative flex w-full md:w-80 border-2 border-primary p-0 bg-transparent">
      {active && !information && (
        <Image
          src="/selected.png"
          alt="Selected plan"
          width={100}
          height={100}
          className="absolute -right-2 -top-2 z-2"
        />
      )}
      <div className="flex w-full h-full flex-col gap-2">
        <div className="w-full rounded-md rounded-b-none bg-primary p-2">
          <CardTitle className="text-secondary tracking-wider text-xl">
            {title}
          </CardTitle>
        </div>
        <CardHeader className="flex flex-row w-full p-4 items-end justify-center">
          <span className="text-4xl font-bold">
            {currencyFormatter.format(value)}
          </span>
          <CardDescription className="text-sm text-primary">
            /mês
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col pb-4 gap-2 text-base h-full">
          {itens?.map((item, index) => (
            <UpgradeCardItem key={index} label={item} />
          ))}
        </CardContent>
        {!information && !active && productId && (
          <UpgradeCheckout productId={productId} />
        )}
      </div>
    </Card>
  );
}
