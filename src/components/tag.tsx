import type { CSSProperties, ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'amber';

const tones: Record<Tone, CSSProperties> = {
  neutral: { background: 'var(--surface-2)', color: 'var(--text-dim)' },
  accent: { background: 'var(--accent-soft)', color: 'var(--accent)' },
  amber: { background: 'var(--amber-soft)', color: 'var(--amber)' },
};

interface TagProps {
  children: ReactNode;
  tone?: Tone;
  style?: CSSProperties;
}

/** A small uppercase pill used for labels like "Seated" or "3 min". */
export function Tag({ children, tone = 'neutral', style }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--mono)',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '4px 9px',
        borderRadius: 999,
        ...tones[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
