import type { ReactNode } from 'react';
import { Button } from './button';

/** Centers its children in the available space. Used for loading and errors. */
function Centered({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: 240,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        textAlign: 'center',
        color: 'var(--text-dim)',
      }}
    >
      {children}
    </div>
  );
}

/** A simple loading spinner with an optional label. */
export function Loading({ label = 'Loading...' }: { label?: string }) {
  return (
    <Centered>
      <div className="gb-spinner" role="status" aria-label={label} />
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{label}</span>
    </Centered>
  );
}

/** An error message with an optional retry button. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Centered>
      <p style={{ margin: 0, maxWidth: 320 }}>{message}</p>
      {onRetry && (
        <Button variant="soft" size="sm" icon="restart" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Centered>
  );
}
