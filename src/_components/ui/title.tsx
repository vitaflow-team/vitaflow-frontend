import { cn } from '@/_lib/utils';
import { HTMLAttributes } from 'react';

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'h1' | 'h2' | 'h3';
  styled?: 'default' | 'form';
  label: string;
  titlePosition?: 'left' | 'center' | 'right';
}

export function Title({
  size = 'h1',
  className,
  label,
  styled = 'default',
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
    styled: {
      default: '',
      form: 'justify-between border-b border-primary text-left py-1',
    },
  };

  // Antes, este componente sempre renderizava uma <div>, ignorando `size` — por isso o
  // site inteiro (públicas + área logada) não tinha nenhum H1-H3 de verdade. Agora a tag
  // HTML acompanha o `size`, sem mudar nada visualmente (as classes continuam as mesmas).
  const Tag = size;

  return (
    <Tag
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
    </Tag>
  );
}
