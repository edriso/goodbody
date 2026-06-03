/** Formats a number of seconds as "3m 05s" or "45s". */
export function formatMinutes(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

/** Returns a time-of-day greeting like "Good morning". */
export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
}
