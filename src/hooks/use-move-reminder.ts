import type { UserSettings } from '@good-bodies/types';
import { useEffect, useRef } from 'react';
import { useMarkMoved } from './use-settings';

/*
 * Keeps the sitting timer honest and lets it nudge you.
 *
 * The timer is intentionally automatic (no "start" button): sitting time
 * accrues continuously, matching the evidence (move every ~30 minutes). But a
 * browser timer that simply counts from `lastMovedAt` would keep ticking while
 * the tab is closed or you are at lunch, so it would show a misleading "4h
 * seated" on return. Like Time Out and similar tools, we treat a long away
 * period as a break and reset the clock.
 *
 * Mounted once at the app root so it runs on every screen.
 */

// Away at least this long ⇒ you stepped away (and almost certainly moved).
const AWAY_RESET_MS = 10 * 60 * 1000;
// A gap this large between one-second ticks means the tab was backgrounded or
// the machine slept; treat it the same as being away.
const SLEEP_GAP_MS = 90 * 1000;
// What the browser tab says when you are over your interval and not looking.
const OVER_TITLE = '\u{1F514} Time to move · Good Bodies';

/** True if this browser supports the Notifications API. */
export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** Ask for notification permission. Returns the resulting permission state. */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) {
    return 'denied';
  }
  if (Notification.permission !== 'default') {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

/** Show a single, calm "time to move" notification (best effort). */
function notifyTimeToMove(): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') {
    return;
  }
  try {
    new Notification('Time to move', {
      body: 'You have been sitting a while. Stand, stretch, or take a quick lap.',
      icon: '/favicon.svg',
      tag: 'good-bodies-move', // collapse repeats into one
    });
  } catch {
    // Some browsers throw if notifications are constructed without a SW; ignore.
  }
}

export function useMoveReminder(settings: UserSettings | undefined): void {
  const markMoved = useMarkMoved();
  const mark = markMoved.mutate;
  const ready = settings !== undefined;

  // Latest values live in a ref so the single interval never re-subscribes.
  const stateRef = useRef({ intervalSec: 1800, lastMovedMs: Date.now(), remindersEnabled: false });
  stateRef.current.intervalSec = (settings?.reminderIntervalMinutes ?? 30) * 60;
  stateRef.current.lastMovedMs = settings ? new Date(settings.lastMovedAt).getTime() : Date.now();
  stateRef.current.remindersEnabled = settings?.remindersEnabled ?? false;

  const hiddenAtRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const baseTitleRef = useRef<string | null>(null);
  const wasOverRef = useRef(false);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (baseTitleRef.current === null) {
      baseTitleRef.current = document.title;
    }

    // A long away period counts as a break: reset the sitting clock.
    const considerAway = (awayMs: number) => {
      if (awayMs >= AWAY_RESET_MS) {
        mark();
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else if (hiddenAtRef.current !== null) {
        considerAway(Date.now() - hiddenAtRef.current);
        hiddenAtRef.current = null;
        lastTickRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const id = window.setInterval(() => {
      const now = Date.now();
      const gap = now - lastTickRef.current;
      lastTickRef.current = now;

      if (gap >= SLEEP_GAP_MS) {
        considerAway(gap);
        return;
      }

      const { intervalSec, lastMovedMs, remindersEnabled } = stateRef.current;
      const over = (now - lastMovedMs) / 1000 >= intervalSec;

      // Fire one gentle notification on the moment you cross the interval.
      if (over && !wasOverRef.current && remindersEnabled) {
        notifyTimeToMove();
      }
      wasOverRef.current = over;

      // Reflect "time to move" in the tab title, but only while you are away
      // from this tab (otherwise the on-screen card already tells you).
      const base = baseTitleRef.current ?? 'Good Bodies';
      const wantTitle = over && document.hidden ? OVER_TITLE : base;
      if (document.title !== wantTitle) {
        document.title = wantTitle;
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(id);
      if (baseTitleRef.current) {
        document.title = baseTitleRef.current;
      }
    };
  }, [ready, mark]);
}
