import { barcodeRects, encodeCode128 } from "@/lib/codes/barcode";
import { encodeQr, qrPath } from "@/lib/codes/qr";

/**
 * QR and Code 128 marks as inline SVG.
 *
 * Both render as plain paths and rects with no external asset, so they survive
 * a print or a PDF export exactly as they appear on screen. Encoding is pure
 * and deterministic, which also keeps the server and client renders identical.
 */

export function QrCode({
  value,
  size = 72,
  className,
  title,
}: {
  value: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const matrix = encodeQr(value);
  if (!matrix) return null;

  const quiet = 4;
  const extent = matrix.size + quiet * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${extent} ${extent}`}
      className={className}
      role="img"
      aria-label={title ?? `QR code for ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={extent} height={extent} fill="#ffffff" />
      <path d={qrPath(matrix, quiet)} fill="#000000" />
    </svg>
  );
}

export function Barcode({
  value,
  width = 180,
  height = 34,
  className,
  showValue = true,
}: {
  value: string;
  width?: number;
  height?: number;
  className?: string;
  showValue?: boolean;
}) {
  const bars = encodeCode128(value);
  if (!bars) return null;

  const captionHeight = showValue ? 11 : 0;
  const barHeight = 40;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${bars.total} ${barHeight + captionHeight}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label={`Barcode for ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={bars.total} height={barHeight + captionHeight} fill="#ffffff" />
      {barcodeRects(bars).map((rect) => (
        <rect
          key={rect.x}
          x={rect.x}
          y={0}
          width={rect.width}
          height={barHeight}
          fill="#000000"
        />
      ))}
      {showValue ? (
        <text
          x={bars.total / 2}
          y={barHeight + 9}
          textAnchor="middle"
          fontSize={9}
          fontFamily="monospace"
          fill="#000000"
        >
          {value}
        </text>
      ) : null}
    </svg>
  );
}
