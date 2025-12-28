'use client';

import { LucideProps } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes, ComponentType } from 'react';
import { Button } from './button';

interface ButtonLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  url: string;
  icon?: ComponentType<LucideProps>;
  variant?: 'default' | 'link' | 'outline';
}

export function ButtonLink({
  label,
  url,
  variant = 'default',
  icon: Icon,
  ...props
}: ButtonLinkProps) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      size="default"
      type="button"
      onClick={() => router.push(url)}
      {...props}
    >
      {Icon && (
        <Icon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      {label}
    </Button>
  );
}
