import type { Routine } from '@good-bodies/types';
import { useMemo } from 'react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Loading, ErrorState } from '@/components/status';
import { Ring } from '@/components/ring';
import { SafetyNote } from '@/components/safety-note';
import { SectionLabel } from '@/components/section-label';
import { Tag } from '@/components/tag';
import { WeekDots } from '@/components/week-dots';
import { useContent, useRoutines } from '@/hooks/use-content';
import { useMarkMoved, useSettings } from '@/hooks/use-settings';
import { useStreak } from '@/hooks/use-movement';
import { useSitTimer } from '@/hooks/use-sit-timer';
import { usePlayerStore } from '@/store/player-store';
import { formatMinutes, greeting } from '@/lib/format';

export function TodayScreen() {
  const openPlayer = usePlayerStore((state) => state.open);
  const markMoved = useMarkMoved();

  const settingsQuery = useSettings();
  const streakQuery = useStreak();
  const routinesQuery = useRoutines();
  const contentQuery = useContent();

  const sit = useSitTimer(settingsQuery.data);

  // Pick one fact for the visit. Stable across re-renders of this screen.
  const facts = contentQuery.data?.facts;
  const fact = useMemo(() => {
    if (!facts || facts.length === 0) {
      return '';
    }
    return facts[Math.floor(Math.random() * facts.length)];
  }, [facts]);

  if (settingsQuery.isLoading || streakQuery.isLoading || routinesQuery.isLoading) {
    return <Loading />;
  }
  if (routinesQuery.isError || streakQuery.isError) {
    return (
      <ErrorState
        message="We could not load your day. Please try again."
        onRetry={() => {
          void routinesQuery.refetch();
          void streakQuery.refetch();
        }}
      />
    );
  }

  const routines = routinesQuery.data ?? [];
  const streak = streakQuery.data;
  const over = sit.over;
  const ringValue = Math.min(sit.elapsed / sit.interval, 1);
  const suggested = routines.slice(0, 3);
  const tagline = contentQuery.data?.tagline ?? '';

  const startRoutine = (routine: Routine | undefined) => {
    if (routine) {
      openPlayer(routine);
    }
  };

  return (
    <div className="gb-screen">
      <header style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 12,
            color: 'var(--text-faint)',
            letterSpacing: '0.06em',
            marginBottom: 6,
          }}
        >
          {new Date()
            .toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
            .toUpperCase()}
        </div>
        <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.03em' }}>{greeting()}.</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--text-dim)', fontSize: 15 }}>{tagline}</p>
      </header>

      {/* Sitting timer hero */}
      <Card
        accent={over}
        pad={22}
        style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Ring
            value={ringValue}
            size={104}
            thickness={7}
            color={over ? 'var(--amber)' : 'var(--accent)'}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 22,
                  fontWeight: 500,
                  lineHeight: 1,
                  color: 'var(--text)',
                }}
              >
                {Math.floor(sit.elapsed / 60)}
                <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>m</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9,
                  color: 'var(--text-faint)',
                  marginTop: 2,
                }}
              >
                SEATED
              </div>
            </div>
          </Ring>
          <div style={{ flex: 1, minWidth: 0 }} role="status" aria-live="polite">
            <Tag tone={over ? 'amber' : 'accent'} style={{ marginBottom: 10 }}>
              <Icon name="clock" size={12} />
              {over ? 'time to move' : 'sitting timer'}
            </Tag>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {over ? "You've been sitting a while." : 'Nice and steady.'}
            </div>
            <p
              style={{
                margin: 0,
                color: 'var(--text-dim)',
                fontSize: 13.5,
                lineHeight: 1.45,
                textWrap: 'pretty',
              }}
            >
              {over
                ? 'Stand up, stretch, or take a short walk. Moving resets the timer.'
                : `Next reminder in ${formatMinutes(Math.max(sit.interval - sit.elapsed, 0))}. The best posture is your next one.`}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Button
            onClick={() => startRoutine(over ? routines[1] : routines[0])}
            variant="primary"
            icon="play"
            style={{ flex: 1 }}
          >
            {over ? 'Stand & stretch' : 'Take a desk reset'}
          </Button>
          <Button onClick={() => markMoved.mutate()} variant="ghost" icon="check">
            I moved
          </Button>
        </div>
      </Card>

      {/* Streak */}
      <Card pad={20} style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Icon name="spark" size={22} />
            </div>
            <div>
              <div
                style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}
              >
                {streak?.currentStreak ?? 0}{' '}
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-dim)' }}>
                  day{streak?.currentStreak === 1 ? '' : 's'}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-faint)' }}>
                current streak · best {streak?.bestStreak ?? 0}
              </div>
            </div>
          </div>
        </div>
        <WeekDots days={streak?.weekStatuses ?? []} />
      </Card>

      {/* Today's plan */}
      <SectionLabel>Today&rsquo;s plan</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {suggested.map((routine) => (
          <RoutineRow key={routine.id} routine={routine} onStart={() => startRoutine(routine)} />
        ))}
      </div>

      {/* Fact */}
      <Card
        pad={18}
        raised
        style={{ marginBottom: 16, display: 'flex', gap: 13, alignItems: 'flex-start' }}
      >
        <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>
          <Icon name="leaf" size={20} />
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--text-dim)',
            textWrap: 'pretty',
          }}
        >
          {fact}
        </p>
      </Card>

      {contentQuery.data && <SafetyNote safety={contentQuery.data.safety} />}
    </div>
  );
}

function RoutineRow({ routine, onStart }: { routine: Routine; onStart: () => void }) {
  return (
    <Card pad={14} onClick={onStart} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--surface-2)',
          color: 'var(--accent)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name="play" size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 2 }}>
          {routine.title}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--text-faint)' }}>
          {routine.tag} · {routine.estimatedMinutes} min
        </div>
      </div>
      <span style={{ color: 'var(--text-faint)' }}>
        <Icon name="chevR" size={20} />
      </span>
    </Card>
  );
}
