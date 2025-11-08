import { cn } from '@/_lib/utils';
import { HTMLAttributes } from 'react';

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'h1' | 'h2' | 'h3';
  label: string;
}

export function Title({
  size = 'h1',
  className,
  label,
  children,
  ...props
}: TitleProps) {
  const buttonClass = {
    size: {
      h1: 'text-xl pt-2',
      h2: 'text-base pt-1',
      h3: 'text-xs',
    },
  };

  return (
    <div
      {...props}
      className={cn(
        'w-full text-center font-semibold',
        buttonClass.size[size],
        className
      )}
    >
      <span className="flex w-full">{label}</span>
      {children}
    </div>
  );
}
