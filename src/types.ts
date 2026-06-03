/*
 * Shared app types. In the original full-stack repo these were Zod-inferred
 * types in a separate `@good-bodies/types` package shared by the API and web
 * app. This frontend-only build inlines them as plain TypeScript interfaces.
 *
 * `@good-bodies/types` is aliased to this file (see vite.config.ts and
 * tsconfig.json), so the copied UI files keep importing from that path
 * unchanged.
 */

// ---- Routines --------------------------------------------------------------

/** "move" is a timed hold or flow, "rest" is a pause, "note" is a setup message. */
export type StepKind = 'move' | 'rest' | 'note';

/** A single step inside a routine. */
export interface ExerciseStep {
  id: string;
  order: number;
  name: string;
  kind: StepKind;
  durationSeconds: number;
  cue: string;
  /** The body area this step targets, for example "Lower back". Can be empty. */
  target: string;
}

/** A guided, follow-along routine made of ordered steps. */
export interface Routine {
  id: string;
  slug: string;
  title: string;
  /** For example "Seated", "Standing", "Micro", "Floor · Strength". */
  tag: string;
  estimatedMinutes: number;
  blurb: string;
  /** The evidence-based reason this routine helps. */
  why: string;
  steps: ExerciseStep[];
}

// ---- Programs --------------------------------------------------------------

/** One session inside a program week. Points at a routine to launch. */
export interface ProgramSession {
  id: string;
  dayLabel: string;
  routineId: string;
  routineSlug: string;
  routineTitle: string;
  note: string;
}

/** One week of a program, with a theme, a focus note, and its sessions. */
export interface ProgramWeek {
  id: string;
  weekNumber: number;
  theme: string;
  focus: string;
  sessions: ProgramSession[];
}

/** A full multi-week program, for example the 6-week "Back Foundations" plan. */
export interface Program {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  weeks: ProgramWeek[];
}

// ---- Movement logs & streaks ----------------------------------------------

/** A record that the user completed some movement. */
export interface MovementLog {
  id: string;
  routineId: string | null;
  completedAt: string;
}

/** Argument to log a completed routine. A plain "I moved" tap omits routineId. */
export interface CreateMovementLogInput {
  routineId?: string;
}

/** The status of a single day in the current week dot-row. */
export type DayStatus = 'done' | 'today' | 'miss' | 'future';

/** Summary of the user's streaks and this week's dots. */
export interface StreakSummary {
  currentStreak: number;
  bestStreak: number;
  /** Seven entries, Monday to Sunday, describing this week's dots. */
  weekStatuses: DayStatus[];
}

// ---- Program progress ------------------------------------------------------

/** A program session the user has checked off. */
export interface ProgramProgress {
  id: string;
  programSessionId: string;
  completedAt: string;
}

// ---- Settings --------------------------------------------------------------

/** The user's personal settings, including the sit-timer reminder interval. */
export interface UserSettings {
  reminderIntervalMinutes: number;
  theme: 'dark' | 'light';
  accent: string;
  /** The last time the user moved. Powers the sitting timer. */
  lastMovedAt: string;
}

/** A partial settings update; change one field or several. */
export interface UpdateSettingsInput {
  reminderIntervalMinutes?: number;
  theme?: 'dark' | 'light';
  accent?: string;
}

// ---- Static content --------------------------------------------------------

/** The tagline, safety note, and rotating evidence-based health facts. */
export interface AppContent {
  tagline: string;
  safety: string;
  facts: string[];
}

// ---- Ergonomics ------------------------------------------------------------

/** One checklist item in the ergonomics setup audit. */
export interface ErgonomicsItem {
  /** A stable key like "feet" or "monitor-h". Used to store the checked state. */
  key: string;
  group: string;
  text: string;
  /** Whether the user has ticked this item. */
  checked: boolean;
}

/** A group of checklist items, for example "Chair" or "Screen". */
export interface ErgonomicsGroup {
  group: string;
  items: ErgonomicsItem[];
}

/** The full ergonomics state plus the computed setup score. */
export interface ErgonomicsState {
  groups: ErgonomicsGroup[];
  checkedCount: number;
  totalCount: number;
  /** A whole number from 0 to 100. */
  score: number;
}
