import type { ReactNode } from 'react';

interface RingProps {
  value?: number;
  size?: number;
  thickness?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}

/** A circular progress ring drawn with SVG. value goes from 0 to 1. */
export function Ring({
  value = 0,
  size = 56,
  thickness = 5,
  color = 'var(--accent)',
  track = 'var(--line)',
  children,
}: RingProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circumference * (1 - clamped);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      {children != null && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
}
