import type { UserSettings } from '@good-bodies/types';
import { useEffect, useState } from 'react';

export interface SitTimer {
  /** Seconds since the user last moved. */
  elapsed: number;
  /** The reminder interval in seconds. */
  interval: number;
  /** True once elapsed has reached the interval. */
  over: boolean;
}

/**
 * Works out how long the user has been sitting, ticking once a second.
 * The maths is done on the client from the server's lastMovedAt value, so the
 * timer stays correct across refreshes and devices.
 */
export function useSitTimer(settings: UserSettings | undefined): SitTimer {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const interval = (settings?.reminderIntervalMinutes ?? 30) * 60;
  const lastMoved = settings ? new Date(settings.lastMovedAt).getTime() : now;
  const elapsed = Math.max(0, Math.floor((now - lastMoved) / 1000));

  return { elapsed, interval, over: elapsed >= interval };
}
