import type { Routine } from '@good-bodies/types';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';

interface FinishScreenProps {
  routine: Routine;
  onClose: () => void;
  onRestart: () => void;
}

/** Shown when a routine is finished. Confirms the log and offers another go. */
export function FinishScreen({ routine, onClose, onRestart }: FinishScreenProps) {
  return (
    <div
      className="gb-fade"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        textAlign: 'center',
        maxWidth: 460,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 24,
        }}
      >
        <Icon name="check" size={46} stroke={2.2} />
      </div>
      <h2 style={{ margin: '0 0 10px', fontSize: 28, letterSpacing: '-0.02em' }}>Nice work.</h2>
      <p
        style={{
          margin: '0 0 28px',
          color: 'var(--text-dim)',
          fontSize: 16,
          lineHeight: 1.55,
          textWrap: 'pretty',
        }}
      >
        That is <strong style={{ color: 'var(--text)' }}>{routine.title}</strong> done and saved.
        Your back thanks you. That is one more step toward feeling looser and stronger.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button onClick={onClose} variant="primary" size="lg" icon="check">
          Done
        </Button>
        <Button onClick={onRestart} variant="ghost" size="lg" icon="restart">
          Again
        </Button>
      </div>
    </div>
  );
}
