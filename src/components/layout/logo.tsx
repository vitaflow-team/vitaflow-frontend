import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 300, height = 150, className = "w-48 md:w-64" }: LogoProps) {
  return (
    <div>
      <Image 
        src="/vitaflow.svg" 
        alt="Vitaflow" 
        width={width} 
        height={height}
        className={cn("dark:hidden", className)}
        priority
      />
      
      <Image 
        src="/vitaflowdark.svg" 
        alt="Vitaflow" 
        width={width} 
        height={height}
        className={cn("hidden dark:block", className)}
        priority
      />
    </div>
  );
}
