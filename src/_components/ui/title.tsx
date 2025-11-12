import { cn } from '@/_lib/utils';
import { HTMLAttributes } from 'react';

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'h1' | 'h2' | 'h3';
  styled?: 'default' | 'form';
  label: string;
}

export function Title({
  size = 'h1',
  className,
  label,
  styled = 'default',
  children,
  ...props
}: TitleProps) {
  const buttonClass = {
    size: {
      h1: 'text-xl pt-2',
      h2: 'text-base pt-1',
      h3: 'text-xs',
    },
    styled: {
      default: '',
      form: 'justify-between border-b border-primary text-left py-1',
    },
  };

  return (
    <div
      {...props}
      className={cn(
        'flex flex-col md:flex-row items-center w-full text-center font-semibold mb-2',
        buttonClass.size[size],
        buttonClass.styled[styled],
        className
      )}
    >
      <span className="w-full">{label}</span>
      {children}
    </div>
  );
}
