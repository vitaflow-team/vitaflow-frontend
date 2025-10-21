'use client';

import { LucideProps } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentType } from 'react';
import { Button } from './button';

interface ButtonLinkProps {
  label: string;
  url: string;
  icon?: ComponentType<LucideProps>;
  variant?: 'default' | 'link';
}

export function ButtonLink({
  label,
  url,
  variant = 'default',
  icon: Icon,
}: ButtonLinkProps) {
  const router = useRouter();

  return (
    <Button variant={variant} size="default" onClick={() => router.push(url)}>
      {Icon && (
        <Icon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      {label}
    </Button>
  );
}
