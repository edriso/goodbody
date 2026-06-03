import type { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  right?: ReactNode;
}

/** A small uppercase heading used above lists and groups. */
export function SectionLabel({ children, right }: SectionLabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '0 0 12px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}
      >
        {children}
      </div>
      {right}
    </div>
  );
}
