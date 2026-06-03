import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from './icon';

type Variant = 'primary' | 'ghost' | 'soft' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  style?: CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit';
  'aria-label'?: string;
}

const sizes: Record<Size, CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: 13 },
  md: { padding: '12px 18px', fontSize: 15 },
  lg: { padding: '16px 22px', fontSize: 16 },
};

const variants: Record<Variant, CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--on-accent)',
    border: '1px solid transparent',
  },
  ghost: { background: 'transparent', color: 'var(--text)', border: '1px solid var(--line)' },
  soft: {
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    border: '1px solid transparent',
  },
  quiet: { background: 'transparent', color: 'var(--text-dim)', border: '1px solid transparent' },
};

/** The shared button. Pill shaped, with optional leading icon. */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  disabled,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="gb-btn gb-tap"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        fontFamily: 'inherit',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        borderRadius: 999,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
}
