import * as React from 'react';

import { cn } from '@/_lib/utils';
import { LucideProps } from 'lucide-react';

export interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ComponentType<LucideProps>;
  onClickIcon?: () => void;
}

function Input({
  className,
  type,
  required,
  disabled,
  id,
  onClickIcon,
  icon: Icon,
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
        type={type}
        data-slot="input"
        className="w-full h-full border-0 outline-none bg-transparent border-hidden"
        {...props}
      />
      {Icon && (
        <label htmlFor={id} onClick={() => handleIconClick()}>
          <Icon
            className={cn(
              'text-slate-400 size-5',
              onClickIcon && !disabled ? 'cursor-pointer' : 'cursor-default',
              className
            )}
          />
        </label>
      )}
    </label>
  );
}

export { Input };
