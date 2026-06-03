import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Loading, ErrorState } from '@/components/status';
import { Ring } from '@/components/ring';
import { SafetyNote } from '@/components/safety-note';
import { SectionLabel } from '@/components/section-label';
import { useContent } from '@/hooks/use-content';
import { useErgonomics, useSetErgonomicsItem } from '@/hooks/use-ergonomics';
import { useMarkMoved, useSettings, useUpdateSettings } from '@/hooks/use-settings';

const REMINDER_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export function SetupScreen() {
  const ergonomicsQuery = useErgonomics();
  const setItem = useSetErgonomicsItem();
  const contentQuery = useContent();
  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();
  const markMoved = useMarkMoved();

  if (ergonomicsQuery.isLoading || settingsQuery.isLoading) {
    return <Loading />;
  }
  if (ergonomicsQuery.isError || !ergonomicsQuery.data) {
    return (
      <ErrorState
        message="We could not load your setup."
        onRetry={() => void ergonomicsQuery.refetch()}
      />
    );
  }

  const ergonomics = ergonomicsQuery.data;
  const settings = settingsQuery.data;
  const reminder = settings?.reminderIntervalMinutes ?? 30;

  const headline =
    ergonomics.score === 100
      ? 'Dialled in.'
      : ergonomics.score >= 60
        ? 'Looking good.'
        : 'Room to improve.';

  return (
    <div className="gb-screen">
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.03em' }}>Setup</h1>
        <p
          style={{ margin: '6px 0 0', color: 'var(--text-dim)', fontSize: 15, textWrap: 'pretty' }}
        >
          A two-minute audit of your workstation. Fix what you can, most of it is free.
        </p>
      </header>

      {/* Score */}
      <Card pad={22} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <Ring
          value={ergonomics.totalCount === 0 ? 0 : ergonomics.checkedCount / ergonomics.totalCount}
          size={88}
          thickness={7}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 600, lineHeight: 1 }}
            >
              {ergonomics.score}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-faint)' }}>
              SCORE
            </div>
          </div>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', marginBottom: 4 }}>
            {headline}
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
            {ergonomics.checkedCount} of {ergonomics.totalCount} checks in place.{' '}
            {ergonomics.score < 100
              ? 'Tick the rest as you fix them.'
              : 'Re-check whenever you change desks.'}
          </p>
        </div>
      </Card>

      {/* Checklist groups */}
      {ergonomics.groups.map((group) => (
        <div key={group.group} style={{ marginBottom: 18 }}>
          <SectionLabel>{group.group}</SectionLabel>
          <Card pad={6}>
            {group.items.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setItem.mutate({ key: item.key, checked: !item.checked })}
                aria-pressed={item.checked}
                className="gb-tap"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderTop: index ? '1px solid var(--line)' : 'none',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '13px 12px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    flexShrink: 0,
                    marginTop: 1,
                    border: item.checked ? 'none' : '1.5px solid var(--line)',
                    background: item.checked ? 'var(--accent)' : 'transparent',
                    color: 'var(--on-accent)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {item.checked && <Icon name="check" size={15} stroke={2.4} />}
                </span>
                <span
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: item.checked ? 'var(--text-dim)' : 'var(--text)',
                    textWrap: 'pretty',
                  }}
                >
                  {item.text}
                </span>
              </button>
            ))}
          </Card>
        </div>
      ))}

      {/* Reminder interval */}
      <SectionLabel>Reminder</SectionLabel>
      <Card pad={18} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ color: 'var(--accent)' }}>
          <Icon name="clock" size={22} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Move every</div>
          <select
            value={reminder}
            onChange={(event) =>
              updateSettings.mutate({ reminderIntervalMinutes: Number(event.target.value) })
            }
            aria-label="Reminder interval in minutes"
            style={{
              fontFamily: 'inherit',
              fontSize: 14,
              color: 'var(--text)',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: '7px 10px',
            }}
          >
            {REMINDER_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => markMoved.mutate()} variant="soft" size="sm">
          Reset now
        </Button>
      </Card>

      {contentQuery.data && <SafetyNote safety={contentQuery.data.safety} expanded />}
    </div>
  );
}
