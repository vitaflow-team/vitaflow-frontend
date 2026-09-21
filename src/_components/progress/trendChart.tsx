'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { getTimeTicks, niceTicks } from '@/_lib/chartAxis';
import { buildTrendSummary } from '@/_lib/chartSummary';
import { formatBmi } from '@/_lib/progressDisplay';
import type { TrendPoint } from '@/_types/progress';
import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** Limites da faixa "Peso normal" da OMS, usados no gráfico de IMC. */
const HEALTHY_BMI_MIN = 18.5;
const HEALTHY_BMI_MAX = 24.9;

type TrendMetric = 'weight' | 'bmi';

interface TrendChartProps {
  title: string;
  points: TrendPoint[];
  period: { weeks: number; start: string; end: string };
  metric: TrendMetric;
}

interface ChartPoint {
  t: number;
  value: number;
}

interface MetricConfig {
  /** Nome da métrica dentro da frase acessível. */
  label: string;
  unit: string;
  /** Token de cor da linha e do preenchimento — ambos com 3:1 contra --card. */
  color: string;
  /**
   * As marcas do eixo vertical trazem só o número; a unidade aparece no balão,
   * no resumo acessível e na tabela escondida, poupando largura no celular.
   */
  axisWidth: number;
  format: (value: number) => string;
}

const METRICS: Record<TrendMetric, MetricConfig> = {
  weight: {
    label: 'Peso',
    unit: 'kg',
    color: 'var(--icon-accent)',
    axisWidth: 44,
    format: value =>
      value.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
  },
  bmi: {
    label: 'IMC',
    unit: '',
    color: 'var(--chart-3)',
    axisWidth: 44,
    format: formatBmi,
  },
};

const axisDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function withUnit(text: string, unit: string): string {
  return unit ? `${text} ${unit}` : text;
}

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: ChartPoint }>;
  config: MetricConfig;
}

/** Balão escuro (tokens primary/foreground) com o valor e a data do ponto. */
function TrendTooltip({ active, payload, config }: TrendTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold">
        {withUnit(config.format(point.value), config.unit)}
      </p>
      <p className="opacity-80">{fullDateFormatter.format(point.t)}</p>
    </div>
  );
}

/**
 * Gráfico de área genérico das duas métricas (ADR-007). O eixo horizontal é uma
 * escala de tempo real que cobre toda a janela informada pela resposta — nunca
 * `Date.now()` — e o eixo vertical usa marcas redondas puras. O desenho fica
 * dentro de um `role="img"` com um resumo em texto, e a tabela escondida logo
 * abaixo é montada do mesmo array, então nunca pode discordar dele (ADR-003).
 */
export function TrendChart({ title, points, period, metric }: TrendChartProps) {
  const gradientId = useId();
  const config = METRICS[metric];

  const startMs = Date.parse(period.start);
  const endMs = Date.parse(period.end);

  const chartPoints: ChartPoint[] = points
    .map(point => ({ t: Date.parse(point.recordedAt), value: point.value }))
    .filter(point => Number.isFinite(point.t) && Number.isFinite(point.value))
    .sort((a, b) => a.t - b.t);

  const summary = buildTrendSummary({
    label: config.label,
    unit: config.unit,
    weeks: period.weeks,
    points: chartPoints,
    format: config.format,
  });

  const isBmi = metric === 'bmi';
  const bandLabel = `Peso normal · ${formatBmi(HEALTHY_BMI_MIN)} – ${formatBmi(
    HEALTHY_BMI_MAX
  )}`;

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        {isBmi && chartPoints.length > 0 && (
          // Rótulo da faixa saudável desenhado em HTML, fora da área de plotagem,
          // para que não possa cobrir a linha nem os rótulos do eixo em telas
          // estreitas (recurso previsto no TechSpec para o rótulo do ReferenceArea).
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: 'var(--sage-bg)',
              color: 'var(--sage)',
            }}
          >
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: 'var(--sage)' }}
            />
            {bandLabel}
          </span>
        )}
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {chartPoints.length === 0 ? (
          // Período vazio: o mesmo resumo neutro do `aria-label`, agora como
          // texto visível, no lugar de uma tabela sem linhas (ADR-003).
          <p className="text-muted-foreground flex h-40 items-center justify-center px-4 text-center text-sm md:h-56">
            {summary}
            {period.weeks < 12
              ? ' Escolha um período maior para ver registros mais antigos.'
              : ''}
          </p>
        ) : (
          <>
            <div role="img" aria-label={summary} className="h-52 md:h-72">
              <TrendChartDrawing
                chartPoints={chartPoints}
                config={config}
                gradientId={gradientId}
                isBmi={isBmi}
                startMs={startMs}
                endMs={endMs}
              />
            </div>
            <table className="sr-only">
              <caption>
                {`${title} — registros das últimas ${period.weeks} semanas`}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">{config.label}</th>
                </tr>
              </thead>
              <tbody>
                {chartPoints.map((point, index) => (
                  <tr key={`${point.t}-${index}`}>
                    <td>{fullDateFormatter.format(point.t)}</td>
                    <td>{withUnit(config.format(point.value), config.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface TrendChartDrawingProps {
  chartPoints: ChartPoint[];
  config: MetricConfig;
  gradientId: string;
  isBmi: boolean;
  startMs: number;
  endMs: number;
}

function TrendChartDrawing({
  chartPoints,
  config,
  gradientId,
  isBmi,
  startMs,
  endMs,
}: TrendChartDrawingProps) {
  const values = chartPoints.map(point => point.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  // No IMC o eixo sempre engloba a faixa saudável, mesmo com todos os valores fora dela.
  const axis = isBmi
    ? niceTicks(
        Math.min(dataMin, HEALTHY_BMI_MIN),
        Math.max(dataMax, HEALTHY_BMI_MAX)
      )
    : niceTicks(dataMin, dataMax);

  const hasLine = chartPoints.length > 1;
  const lastPoint = chartPoints[chartPoints.length - 1];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartPoints}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        accessibilityLayer={false}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={config.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--line)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="t"
          type="number"
          scale="time"
          domain={[startMs, endMs]}
          ticks={getTimeTicks(startMs, endMs)}
          tickFormatter={value => axisDateFormatter.format(Number(value))}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis
          type="number"
          domain={[axis.min, axis.max]}
          ticks={axis.ticks}
          tickFormatter={value => config.format(Number(value))}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          width={config.axisWidth}
        />
        {isBmi && (
          <ReferenceArea
            y1={HEALTHY_BMI_MIN}
            y2={HEALTHY_BMI_MAX}
            fill="var(--sage-bg)"
            fillOpacity={1}
            stroke="none"
            ifOverflow="hidden"
          />
        )}
        <Tooltip
          content={<TrendTooltip config={config} />}
          cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={config.color}
          strokeWidth={hasLine ? 2.5 : 0}
          fill={`url(#${gradientId})`}
          fillOpacity={hasLine ? 1 : 0}
          dot={{
            fill: config.color,
            stroke: 'var(--card)',
            strokeWidth: 1,
            r: 3,
          }}
          activeDot={{ r: 5, fill: config.color, stroke: 'var(--card)' }}
          isAnimationActive={false}
        />
        {/* Último ponto em destaque: um marcador maior por cima da série. */}
        <ReferenceDot
          x={lastPoint.t}
          y={lastPoint.value}
          r={5.5}
          fill={config.color}
          stroke="var(--card)"
          strokeWidth={2}
          ifOverflow="visible"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
