'use client';

import { getInitialsName } from '@/_lib/getInitials';
import { cn } from '@/_lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const avatarVariants = cva('border-2', {
  variants: {
    size: {
      default: 'h-12 w-12',
      sm: 'h-6 w-6',
      lg: 'h-40 w-40',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  src: string | null | undefined;
  name?: string | null;
}

export function UserAvatar({ size, src, name }: UserAvatarProps) {
  const initials = getInitialsName(name);

  return (
    <Avatar className={cn(avatarVariants({ size }))}>
      <AvatarImage src={src ?? undefined} />
      <AvatarFallback>
        {initials || <UserRound aria-hidden="true" className="size-1/2" />}
      </AvatarFallback>
    </Avatar>
  );
}
