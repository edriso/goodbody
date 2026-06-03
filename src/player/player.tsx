import type { Routine } from '@good-bodies/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icon';
import { Ring } from '@/components/ring';
import { Tag } from '@/components/tag';
import { useLogMovement } from '@/hooks/use-movement';
import { usePlayerStore } from '@/store/player-store';
import { FinishScreen } from './finish-screen';

/**
 * The full-screen, follow-along player. Steps through a routine one move at a
 * time with a per-step countdown ring, play/pause, skip, back, and restart.
 * Mounted once at the app root; it shows itself when a routine is active.
 */
export function Player() {
  const routine = usePlayerStore((state) => state.activeRoutine);
  const close = usePlayerStore((state) => state.close);
  const logMovement = useLogMovement();

  if (!routine) {
    return null;
  }

  return (
    <PlayerInner
      key={routine.id}
      routine={routine}
      onClose={close}
      onComplete={() => logMovement.mutate({ routineId: routine.id })}
    />
  );
}

interface PlayerInnerProps {
  routine: Routine;
  onClose: () => void;
  onComplete: () => void;
}

function PlayerInner({ routine, onClose, onComplete }: PlayerInnerProps) {
  const steps = routine.steps;
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(steps[0].durationSeconds);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const completionFired = useRef(false);

  // Tick the countdown down by one second while playing.
  useEffect(() => {
    if (!playing || finished || remaining <= 0) {
      return;
    }
    const id = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [playing, finished, remaining]);

  // When a step reaches zero, move to the next one (or finish).
  useEffect(() => {
    if (finished || remaining > 0) {
      return;
    }
    if (index + 1 >= steps.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setRemaining(steps[index + 1].durationSeconds);
    }
  }, [remaining, finished, index, steps]);

  // Fire the completion callback exactly once.
  useEffect(() => {
    if (finished && !completionFired.current) {
      completionFired.current = true;
      onComplete();
    }
  }, [finished, onComplete]);

  // Close on the Escape key.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const goBy = useCallback(
    (delta: number) => {
      setFinished(false);
      completionFired.current = false;
      setIndex((current) => {
        const next = Math.max(0, Math.min(steps.length - 1, current + delta));
        setRemaining(steps[next].durationSeconds);
        return next;
      });
    },
    [steps],
  );

  const restart = useCallback(() => {
    setFinished(false);
    completionFired.current = false;
    setIndex(0);
    setRemaining(steps[0].durationSeconds);
    setPlaying(true);
  }, [steps]);

  const step = steps[index];
  const stepProgress = step
    ? (step.durationSeconds - Math.max(remaining, 0)) / step.durationSeconds
    : 1;
  const overall = (index + stepProgress) / steps.length;
  const ringColor = step && step.kind === 'rest' ? 'var(--text-dim)' : 'var(--accent)';

  return (
    <div
      className="gb-fade"
      role="dialog"
      aria-modal="true"
      aria-label={`${routine.title} player`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
        <button onClick={onClose} className="gb-iconbtn gb-tap" aria-label="Close player">
          <Icon name="x" size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{routine.title}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-faint)' }}>
            {finished ? 'complete' : `step ${index + 1} / ${steps.length}`}
          </div>
        </div>
        {!finished && (
          <button onClick={restart} className="gb-iconbtn gb-tap" aria-label="Restart routine">
            <Icon name="restart" size={20} />
          </button>
        )}
      </div>

      {/* Overall progress strip */}
      <div
        style={{
          height: 3,
          background: 'var(--line)',
          margin: '0 20px',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${overall * 100}%`,
            background: 'var(--accent)',
            transition: 'width .4s ease',
          }}
        />
      </div>

      {finished ? (
        <FinishScreen routine={routine} onClose={onClose} onRestart={restart} />
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '8px 22px 22px',
            maxWidth: 560,
            width: '100%',
            margin: '0 auto',
          }}
        >
          {/* Demo placeholder panel */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              aspectRatio: '16 / 9',
              marginBottom: 22,
              background:
                'repeating-linear-gradient(135deg, var(--surface) 0 14px, var(--surface-2) 14px 28px)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--text-faint)',
                letterSpacing: '0.03em',
              }}
            >
              {`// demo loop · ${step.name.toLowerCase()}`}
            </span>
            <span style={{ position: 'absolute', top: 12, left: 14 }}>
              <Tag tone={step.kind === 'rest' ? 'neutral' : 'accent'}>
                {step.target || step.kind}
              </Tag>
            </span>
          </div>

          {/* Ring timer and current move */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18 }}>
            <Ring value={stepProgress} size={92} thickness={6} color={ringColor}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 26,
                    fontWeight: 500,
                    lineHeight: 1,
                    color: 'var(--text)',
                  }}
                >
                  {Math.max(remaining, 0)}
                </div>
                <div
                  style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-faint)' }}
                >
                  sec
                </div>
              </div>
            </Ring>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: '0 0 6px',
                  fontSize: 24,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {step.name}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-dim)',
                  fontSize: 15,
                  lineHeight: 1.5,
                  textWrap: 'pretty',
                }}
              >
                {step.cue}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'center',
              marginTop: 6,
            }}
          >
            <button
              onClick={() => goBy(-1)}
              disabled={index === 0}
              className="gb-iconbtn gb-tap"
              style={{ opacity: index === 0 ? 0.35 : 1 }}
              aria-label="Previous step"
            >
              <Icon name="chevL" size={24} />
            </button>
            <button
              onClick={() => setPlaying((value) => !value)}
              className="gb-tap"
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                border: 'none',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <Icon name={playing ? 'pause' : 'play'} size={30} stroke={2} />
            </button>
            <button onClick={() => goBy(1)} className="gb-iconbtn gb-tap" aria-label="Next step">
              <Icon name="chevR" size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
