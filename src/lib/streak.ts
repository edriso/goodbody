/*
 * Pure helpers for working out streaks from a list of completion times.
 * Ported unchanged from the original API (movement-logs/streak.util.ts).
 *
 * Design notes (these matter for the edge cases):
 * - A "day" is a calendar day in UTC. We turn each timestamp into a whole
 *   "day number" (days since 1970-01-01 UTC). One fixed time zone keeps the
 *   maths simple and stable.
 * - Completing more than once on the same day counts as a single day.
 * - The current streak may end today OR yesterday, so it does not look broken
 *   simply because you have not moved yet today.
 *
 * Every function here is pure: same input, same output, no clocks or globals.
 */
import type { DayStatus } from '@good-bodies/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Turns a timestamp into a whole day number (days since the Unix epoch, UTC). */
export function toDayNumber(date: Date): number {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor(utcMidnight / MS_PER_DAY);
}

/** The set of distinct day numbers that have at least one completion. */
export function uniqueDayNumbers(dates: Date[]): Set<number> {
  return new Set(dates.map(toDayNumber));
}

/**
 * The current streak: how many consecutive days (ending today or yesterday)
 * have a completion. Returns 0 when there is no recent activity.
 */
export function computeCurrentStreak(dates: Date[], now: Date): number {
  const days = uniqueDayNumbers(dates);
  const today = toDayNumber(now);
  let anchor = days.has(today) ? today : today - 1;
  let streak = 0;
  while (days.has(anchor)) {
    streak += 1;
    anchor -= 1;
  }
  return streak;
}

/** The longest run of consecutive days anywhere in the history. */
export function computeBestStreak(dates: Date[]): number {
  const days = [...uniqueDayNumbers(dates)].sort((a, b) => a - b);
  if (days.length === 0) {
    return 0;
  }
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

/**
 * The seven dots for the current week, Monday to Sunday.
 * - "done": there was a completion that day
 * - "today": it is today and there is no completion yet
 * - "miss": a past day this week with no completion
 * - "future": a day later this week
 */
export function computeWeekStatuses(dates: Date[], now: Date): DayStatus[] {
  const days = uniqueDayNumbers(dates);
  const today = toDayNumber(now);
  // getUTCDay: 0 = Sunday ... 6 = Saturday. Convert so Monday = 0.
  const dayOfWeek = (new Date(today * MS_PER_DAY).getUTCDay() + 6) % 7;
  const monday = today - dayOfWeek;

  const statuses: DayStatus[] = [];
  for (let i = 0; i < 7; i += 1) {
    const day = monday + i;
    if (days.has(day)) {
      statuses.push('done');
    } else if (day === today) {
      statuses.push('today');
    } else if (day < today) {
      statuses.push('miss');
    } else {
      statuses.push('future');
    }
  }
  return statuses;
}
