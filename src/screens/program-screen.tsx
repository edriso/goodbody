import type { ProgramSession, ProgramWeek, Routine } from '@good-bodies/types';
import { useState } from 'react';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Loading, ErrorState } from '@/components/status';
import { Tag } from '@/components/tag';
import { useRoutines, usePrograms } from '@/hooks/use-content';
import { useProgramProgress, useToggleSession } from '@/hooks/use-program-progress';
import { usePlayerStore } from '@/store/player-store';

export function ProgramScreen() {
  const programsQuery = usePrograms();
  const routinesQuery = useRoutines();
  const progressQuery = useProgramProgress();

  if (programsQuery.isLoading || routinesQuery.isLoading || progressQuery.isLoading) {
    return <Loading />;
  }
  if (programsQuery.isError || !programsQuery.data || programsQuery.data.length === 0) {
    return (
      <ErrorState
        message="We could not load the program."
        onRetry={() => void programsQuery.refetch()}
      />
    );
  }

  const program = programsQuery.data[0];
  const routines = routinesQuery.data ?? [];
  const completed = progressQuery.data ?? new Set<string>();

  return <ProgramView program={program} routines={routines} completed={completed} />;
}

interface ProgramViewProps {
  program: NonNullable<ReturnType<typeof usePrograms>['data']>[number];
  routines: Routine[];
  completed: Set<string>;
}

function ProgramView({ program, routines, completed }: ProgramViewProps) {
  const openPlayer = usePlayerStore((state) => state.open);
  const toggle = useToggleSession();

  const allSessions = program.weeks.flatMap((week) => week.sessions);
  const totalSessions = allSessions.length;
  const doneCount = allSessions.filter((session) => completed.has(session.id)).length;

  const isWeekDone = (week: ProgramWeek) => week.sessions.every((s) => completed.has(s.id));

  // Open the first week that is not fully complete (or the first week).
  const initialOpen = Math.max(
    0,
    program.weeks.findIndex((week) => !isWeekDone(week)),
  );
  const [open, setOpen] = useState(initialOpen);

  const startSession = (session: ProgramSession) => {
    const routine = routines.find((r) => r.id === session.routineId);
    if (routine) {
      openPlayer(routine);
    }
  };

  return (
    <div className="gb-screen">
      <header style={{ marginBottom: 20 }}>
        <Tag tone="accent" style={{ marginBottom: 12 }}>
          {program.weeks.length}-week program
        </Tag>
        <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.03em' }}>{program.title}</h1>
        <p
          style={{
            margin: '8px 0 0',
            color: 'var(--text-dim)',
            fontSize: 15,
            lineHeight: 1.5,
            textWrap: 'pretty',
          }}
        >
          {program.blurb}
        </p>
      </header>

      {/* Overall progress */}
      <Card pad={20} style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color: 'var(--text-faint)',
              letterSpacing: '0.06em',
            }}
          >
            PROGRESS
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)' }}>
            {doneCount} / {totalSessions} sessions
          </div>
        </div>
        <div
          style={{
            height: 8,
            background: 'var(--surface-2)',
            borderRadius: 99,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${totalSessions === 0 ? 0 : (doneCount / totalSessions) * 100}%`,
              background: 'var(--accent)',
              borderRadius: 99,
              transition: 'width .5s ease',
            }}
          />
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {program.weeks.map((week, weekIndex) => {
          const weekDone = isWeekDone(week);
          const isOpen = open === weekIndex;
          return (
            <Card key={week.id} pad={0} accent={isOpen} style={{ overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : weekIndex)}
                aria-expanded={isOpen}
                className="gb-tap"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  padding: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: weekDone ? 'var(--accent)' : 'var(--surface-2)',
                    color: weekDone ? 'var(--on-accent)' : 'var(--text-dim)',
                    fontFamily: 'var(--mono)',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {weekDone ? <Icon name="check" size={20} stroke={2.2} /> : week.weekNumber}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10.5,
                      color: 'var(--text-faint)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    WEEK {week.weekNumber}
                  </div>
                  <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{week.theme}</div>
                </div>
                <span
                  style={{
                    color: 'var(--text-faint)',
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform .25s',
                  }}
                >
                  <Icon name="chevR" size={20} />
                </span>
              </button>

              {isOpen && (
                <div className="gb-fade" style={{ padding: '0 18px 18px' }}>
                  <p
                    style={{
                      margin: '0 0 14px',
                      color: 'var(--text-dim)',
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      textWrap: 'pretty',
                    }}
                  >
                    {week.focus}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {week.sessions.map((session) => {
                      const done = completed.has(session.id);
                      return (
                        <div
                          key={session.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            borderRadius: 12,
                            background: 'var(--surface-2)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggle.mutate({ programSessionId: session.id, done: !done })
                            }
                            className="gb-tap"
                            aria-label={done ? 'Mark session not done' : 'Mark session done'}
                            aria-pressed={done}
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 8,
                              flexShrink: 0,
                              cursor: 'pointer',
                              border: done ? 'none' : '1.5px solid var(--line)',
                              background: done ? 'var(--accent)' : 'transparent',
                              color: 'var(--on-accent)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {done && <Icon name="check" size={16} stroke={2.4} />}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>
                              <span
                                style={{
                                  fontFamily: 'var(--mono)',
                                  color: 'var(--text-faint)',
                                  fontWeight: 500,
                                  marginRight: 8,
                                }}
                              >
                                {session.dayLabel}
                              </span>
                              {session.routineTitle}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                              {session.note}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => startSession(session)}
                            className="gb-iconbtn gb-tap"
                            aria-label={`Start ${session.routineTitle}`}
                            style={{ flexShrink: 0 }}
                          >
                            <Icon name="play" size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
