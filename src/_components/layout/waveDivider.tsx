interface WaveDividerProps {
  /** Cor de preenchimento da onda — geralmente a cor de fundo da seção seguinte. */
  fill: string;
  /** Vira a onda de cabeça para baixo, útil para alternar o sentido do fluxo. */
  flip?: boolean;
  className?: string;
}

/**
 * Divisória em forma de onda entre seções — o mesmo recurso usado na proposta de
 * landing page para dar continuidade visual ao símbolo da marca (fluxo/ondas) em vez
 * de blocos de cor com corte reto.
 */
export function WaveDivider({ fill, flip, className }: WaveDividerProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block w-full h-10 md:h-16 ${flip ? '-scale-y-100' : ''} ${className ?? ''}`}
    >
      <path
        d="M0,40 C240,80 480,0 720,24 C960,48 1200,80 1440,32 L1440,80 L0,80 Z"
        fill={fill}
      />
    </svg>
  );
}
