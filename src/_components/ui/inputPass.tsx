'use client';

import { Eye, EyeOffIcon } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Input } from './input';

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface InputPassProps extends InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = forwardRef<HTMLInputElement, InputPassProps>(
  ({ ...props }, ref) => {
    const [isPassword, setIsPassword] = useState(true);

    return (
      <Input
        ref={ref}
        {...props}
        type={isPassword ? 'password' : 'text'}
        icon={isPassword ? Eye : EyeOffIcon}
        onClickIcon={() => setIsPassword(!isPassword)}
      />
    );
  }
);

InputPassword.displayName = 'InputPassword';

export { InputPassword };
