import type { DayStatus } from '@good-bodies/types';
import { Icon } from './icon';

interface WeekDotsProps {
  days: DayStatus[];
  size?: number;
}

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** The Monday-to-Sunday row of streak dots shown on the Today screen. */
export function WeekDots({ days, size = 30 }: WeekDotsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
      {LABELS.map((label, index) => {
        const status = days[index];
        const background =
          status === 'done'
            ? 'var(--accent)'
            : status === 'today'
              ? 'transparent'
              : 'var(--surface-2)';
        const border =
          status === 'today'
            ? '2px dashed var(--accent)'
            : status === 'miss'
              ? '1px solid var(--line)'
              : '1px solid transparent';

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              flex: 1,
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background,
                border,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--on-accent)',
              }}
            >
              {status === 'done' && <Icon name="check" size={size * 0.6} stroke={2.2} />}
            </div>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: status === 'today' ? 'var(--accent)' : 'var(--text-faint)',
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
