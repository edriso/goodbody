import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Loading, ErrorState } from '@/components/status';
import { Tag } from '@/components/tag';
import { useRoutines } from '@/hooks/use-content';
import { usePlayerStore } from '@/store/player-store';

export function MoveScreen() {
  const openPlayer = usePlayerStore((state) => state.open);
  const { data: routines, isLoading, isError, refetch } = useRoutines();

  if (isLoading) {
    return <Loading />;
  }
  if (isError || !routines) {
    return <ErrorState message="We could not load the routines." onRetry={() => void refetch()} />;
  }

  return (
    <div className="gb-screen">
      <header style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.03em' }}>Move</h1>
        <p
          style={{ margin: '6px 0 0', color: 'var(--text-dim)', fontSize: 15, textWrap: 'pretty' }}
        >
          Follow-along routines you can do at your desk or on the floor. Start any one.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {routines.map((routine) => (
          <Card key={routine.id} pad={18} onClick={() => openPlayer(routine)}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag tone="accent">{routine.tag}</Tag>
                <Tag>
                  <Icon name="clock" size={12} />
                  {routine.estimatedMinutes} min
                </Tag>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: 'var(--accent)',
                  color: 'var(--on-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="play" size={18} />
              </div>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: 19, letterSpacing: '-0.02em' }}>
              {routine.title}
            </h3>
            <p
              style={{
                margin: '0 0 12px',
                color: 'var(--text-dim)',
                fontSize: 14.5,
                lineHeight: 1.5,
                textWrap: 'pretty',
              }}
            >
              {routine.blurb}
            </p>
            <div
              style={{
                borderTop: '1px solid var(--line)',
                paddingTop: 12,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: 'var(--text-faint)', marginTop: 1, flexShrink: 0 }}>
                <Icon name="info" size={15} />
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  color: 'var(--text-faint)',
                  textWrap: 'pretty',
                }}
              >
                {routine.why}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
