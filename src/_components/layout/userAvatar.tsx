'use client';

import { getInitialsName } from '@/_lib/getInitials';
import { cn } from '@/_lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSession } from 'next-auth/react';
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

export function UserAvatar({ size }: VariantProps<typeof avatarVariants>) {
  const { data: session } = useSession();

  const imageUser: string =
    session &&
    session.user &&
    session.user.image !== null &&
    session.user.image !== undefined
      ? session.user.image
      : '';

  return (
    <Avatar className={cn(avatarVariants({ size }))}>
      <AvatarImage src={imageUser} />
      <AvatarFallback>{getInitialsName(session?.user?.name)}</AvatarFallback>
    </Avatar>
  );
}
