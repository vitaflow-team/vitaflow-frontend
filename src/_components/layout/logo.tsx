import { cn } from '@/_lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  /** Dentro do app a marca leva para o Início, não para o site público. */
  href?: string;
}

export function Logo({
  width = 300,
  height = 150,
  className = 'w-48 md:w-64',
  href = '/',
}: LogoProps) {
  return (
    <Link href={href}>
      <Image
        src="/vitaflow.svg"
        alt="Vitaflow"
        width={width}
        height={height}
        className={cn('dark:hidden', className)}
        priority
      />

      <Image
        src="/vitaflowdark.svg"
        alt="Vitaflow"
        width={width}
        height={height}
        className={cn('hidden dark:block', className)}
        priority
      />
    </Link>
  );
}
