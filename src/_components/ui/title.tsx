import { cn } from '@/_lib/utils';
import { HTMLAttributes } from 'react';

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'h1' | 'h2' | 'h3';
  label: string;
  titlePosition?: 'left' | 'center' | 'right';
}

export function Title({
  size = 'h1',
  className,
  label,
  children,
  titlePosition = 'left',
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
      className={cn('w-full font-semibold', buttonClass.size[size], className)}
    >
      <span
        className={cn(
          'flex w-full',
          titlePosition === 'center' ? 'justify-center' : '',
          titlePosition === 'right' ? 'justify-end' : ''
        )}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
