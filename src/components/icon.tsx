import type { CSSProperties, ReactElement } from 'react';

export type IconName =
  | 'today'
  | 'move'
  | 'program'
  | 'setup'
  | 'play'
  | 'pause'
  | 'check'
  | 'chevL'
  | 'chevR'
  | 'x'
  | 'clock'
  | 'spark'
  | 'plus'
  | 'restart'
  | 'arrowR'
  | 'info'
  | 'walk'
  | 'leaf';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
}

/**
 * A small set of minimal, geometric line icons, ported from the design
 * prototype so the look matches exactly. Decorative by default (aria-hidden).
 */
export function Icon({ name, size = 22, stroke = 1.75, style }: IconProps): ReactElement {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<IconName, ReactElement> = {
    today: (
      <>
        <path {...p} d="M4 11.5 12 5l8 6.5" />
        <path {...p} d="M6 10.5V19h12v-8.5" />
        <path {...p} d="M10 19v-4h4v4" />
      </>
    ),
    move: <path {...p} d="M3 13h3.2l2-5 3.4 9 2.2-6 1.5 2h4.7" />,
    program: (
      <>
        <rect {...p} x="4" y="5" width="16" height="16" rx="2.5" />
        <path {...p} d="M4 9.5h16M8 3.5v3M16 3.5v3" />
        <path {...p} d="M8 13h2M8 16.5h5" />
      </>
    ),
    setup: (
      <>
        <path {...p} d="M5 8h9M5 16h5" />
        <path {...p} d="M17 6v4M11 14v4" />
        <circle {...p} cx="17" cy="8" r="2.2" />
        <circle {...p} cx="11" cy="16" r="2.2" />
      </>
    ),
    play: <path {...p} d="M8 5.5 18 12 8 18.5z" />,
    pause: <path {...p} d="M9 5.5v13M15 5.5v13" />,
    check: <path {...p} d="M5 12.5 9.5 17 19 7" />,
    chevL: <path {...p} d="M14.5 6 8.5 12l6 6" />,
    chevR: <path {...p} d="M9.5 6l6 6-6 6" />,
    x: <path {...p} d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />,
    clock: (
      <>
        <circle {...p} cx="12" cy="12" r="8" />
        <path {...p} d="M12 7.5V12l3 2" />
      </>
    ),
    spark: (
      <>
        <path {...p} d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        <path {...p} d="M7.5 7.5l2.5 2.5M16.5 7.5 14 10M7.5 16.5 10 14M16.5 16.5 14 14" />
      </>
    ),
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    restart: (
      <>
        <path {...p} d="M5 12a7 7 0 1 0 2-4.9" />
        <path {...p} d="M4.5 4v3.5H8" />
      </>
    ),
    arrowR: <path {...p} d="M5 12h13M13 6.5 18.5 12 13 17.5" />,
    info: (
      <>
        <circle {...p} cx="12" cy="12" r="8.5" />
        <path {...p} d="M12 11v5" />
        <circle cx="12" cy="8" r="1.1" fill="currentColor" />
      </>
    ),
    walk: (
      <>
        <circle cx="13" cy="5" r="1.6" fill="currentColor" />
        <path {...p} d="M13 8l-2 4 2 2v5M13 8l3 2M11 12l-3 1M9 21l2-7" />
      </>
    ),
    leaf: (
      <>
        <path {...p} d="M6 18C6 9 12 5 19 5c0 9-6 13-13 13Z" />
        <path {...p} d="M9 15c2-3 5-5 8-6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
