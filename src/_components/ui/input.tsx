import * as React from 'react';

import { cn } from '@/_lib/utils';
import { LucideProps } from 'lucide-react';

export interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ComponentType<LucideProps>;
  onClickIcon?: () => void;
  /** Nome acessível do ícone quando ele é clicável (ex.: "Mostrar senha"). */
  iconLabel?: string;
}

function Input({
  className,
  type,
  required,
  disabled,
  id,
  onClickIcon,
  icon: Icon,
  iconLabel,
  ...props
}: InputProps) {
  function handleIconClick() {
    if (disabled) {
      return;
    }

    if (onClickIcon) {
      onClickIcon();
    }
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        required ? 'border-l-4 border-l-primary' : 'pl-4',
        disabled ? 'opacity-60' : '',
        className
      )}
    >
      <input
        id={id}
        type={type}
        data-slot="input"
        className="w-full h-full border-0 outline-none bg-transparent border-hidden"
        {...props}
      />
      {Icon && onClickIcon ? (
        <button
          type="button"
          onClick={handleIconClick}
          disabled={disabled}
          aria-label={iconLabel ?? 'Alternar'}
          className="disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <Icon className="text-muted-foreground size-5 cursor-pointer" />
        </button>
      ) : (
        Icon && (
          <label htmlFor={id}>
            <Icon className="text-muted-foreground size-5 cursor-default" />
          </label>
        )
      )}
    </label>
  );
}

export { Input };
