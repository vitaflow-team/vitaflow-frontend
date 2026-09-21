import { buildSparkline } from '@/_lib/sparkline';

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
}

/**
 * Linha de tendência puramente decorativa: os números que importam estão no
 * card, e a evolução completa vive em Minha evolução. Por isso é SVG simples e
 * `aria-hidden`, sem entrar na árvore de acessibilidade.
 */
export function Sparkline({
  values,
  width = 100,
  height = 32,
}: SparklineProps) {
  const sparkline = buildSparkline(values, width, height);
  if (!sparkline) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
      preserveAspectRatio="none"
      className="h-8 w-full overflow-visible text-icon-accent"
    >
      <path
        d={sparkline.path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
