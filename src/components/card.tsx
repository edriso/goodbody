import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
  raised?: boolean;
  accent?: boolean;
  onClick?: () => void;
}

/** The basic surface used across the app. Becomes a button when onClick is set. */
export function Card({
  children,
  style,
  pad = 20,
  raised = false,
  accent = false,
  onClick,
}: CardProps) {
  const sharedStyle: CSSProperties = {
    background: raised ? 'var(--surface-2)' : 'var(--surface)',
    border: `1px solid ${accent ? 'var(--accent-line)' : 'var(--line)'}`,
    borderRadius: 'var(--radius)',
    padding: pad,
    ...style,
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="gb-card gb-tap"
        style={{
          ...sharedStyle,
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
          width: '100%',
          display: 'block',
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="gb-card" style={sharedStyle}>
      {children}
    </div>
  );
}
