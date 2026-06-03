/*
 * Local persistence. In the full-stack app this data lived in MySQL per user;
 * here it lives in the browser's localStorage. Everything is namespaced under
 * "gb:" and read/written through safe JSON helpers.
 */
import type { MovementLog, UserSettings } from '@good-bodies/types';

export const STORAGE_KEYS = {
  settings: 'gb:settings',
  movementLogs: 'gb:movement-logs',
  program: 'gb:program',
  ergonomics: 'gb:ergonomics',
} as const;

/** Read and JSON-parse a key, returning the fallback on miss or parse error. */
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON-stringify and write a key. Storage errors (e.g. quota) are swallowed. */
function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore: a full or unavailable store should not crash the app.
  }
}

// ---- Settings --------------------------------------------------------------

/** Defaults match the original Prisma schema's UserSettings defaults. */
export function defaultSettings(): UserSettings {
  return {
    reminderIntervalMinutes: 30,
    theme: 'dark',
    accent: '#5fbf9b',
    lastMovedAt: new Date().toISOString(),
    remindersEnabled: false,
  };
}

export function getSettings(): UserSettings {
  const stored = readJSON<Partial<UserSettings> | null>(STORAGE_KEYS.settings, null);
  if (!stored) {
    const fresh = defaultSettings();
    writeJSON(STORAGE_KEYS.settings, fresh);
    return fresh;
  }
  // Merge over defaults so a newly added field is always present.
  return { ...defaultSettings(), ...stored };
}

export function setSettings(settings: UserSettings): UserSettings {
  writeJSON(STORAGE_KEYS.settings, settings);
  return settings;
}

// ---- Movement logs ---------------------------------------------------------

export function getMovementLogs(): MovementLog[] {
  return readJSON<MovementLog[]>(STORAGE_KEYS.movementLogs, []);
}

export function setMovementLogs(logs: MovementLog[]): void {
  writeJSON(STORAGE_KEYS.movementLogs, logs);
}

// ---- Program progress (set of completed session ids) -----------------------

export function getProgramProgress(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.program, []);
}

export function setProgramProgress(sessionIds: string[]): void {
  writeJSON(STORAGE_KEYS.program, sessionIds);
}

// ---- Ergonomics answers (item key -> checked) ------------------------------

export function getErgonomicsChecks(): Record<string, boolean> {
  return readJSON<Record<string, boolean>>(STORAGE_KEYS.ergonomics, {});
}

export function setErgonomicsChecks(checks: Record<string, boolean>): void {
  writeJSON(STORAGE_KEYS.ergonomics, checks);
}
