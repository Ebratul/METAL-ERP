import { cn } from "@/lib/utils/cn";

interface SparklineProps {
  data: number[];
  /** Any CSS colour — pass a token like `var(--series-1)`. */
  color?: string;
  width?: number;
  height?: number;
  /** Fill the area under the line with a low-alpha wash. */
  area?: boolean;
  className?: string;
  /** Accessible summary; the value it accompanies carries the real number. */
  label?: string;
}

/**
 * A bare trend mark — no axes, no grid, no tooltip. It is decoration beside a
 * number that already states the value, so it deliberately skips the hover
 * layer a real chart would carry.
 */
export function Sparkline({
  data,
  color = "var(--series-1)",
  width = 96,
  height = 28,
  area = true,
  className,
  label,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  // 2px inset top and bottom so the stroke is never clipped.
  const inset = 2;
  const usable = height - inset * 2;

  const points = data.map((value, index) => {
    const x = index * stepX;
    const y = inset + usable - ((value - min) / span) * usable;
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const fill = `${line} L${width},${height} L0,${height} Z`;
  const gradientId = `spark-${Math.abs(
    data.reduce((acc, n, i) => acc + n * (i + 1), 0) | 0,
  )}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={label ?? "Trend"}
      preserveAspectRatio="none"
    >
      {area ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={fill} fill={`url(#${gradientId})`} />
        </>
      ) : null}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

/** Tiny discrete bars — used where the series is counts rather than a flow. */
export function MicroBars({
  data,
  color = "var(--series-1)",
  width = 96,
  height = 28,
  className,
  label,
}: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data) || 1;
  // 2px surface gap between adjacent bars.
  const gap = 2;
  const barWidth = Math.max(1.5, (width - gap * (data.length - 1)) / data.length);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={label ?? "Distribution"}
    >
      {data.map((value, index) => {
        const barHeight = Math.max(1.5, (value / max) * height);
        return (
          <rect
            key={index}
            x={index * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1.5}
            fill={color}
            opacity={0.35 + (value / max) * 0.65}
          />
        );
      })}
    </svg>
  );
}
