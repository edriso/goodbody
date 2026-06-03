import type { CreateMovementLogInput, MovementLog, StreakSummary } from '@good-bodies/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { getMovementLogs, getSettings, setMovementLogs, setSettings } from '@/lib/storage';
import { computeBestStreak, computeCurrentStreak, computeWeekStatuses } from '@/lib/streak';

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `log-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

/** Current streak, best streak, and this week's seven dots. */
export function useStreak() {
  return useQuery({
    queryKey: queryKeys.streak,
    queryFn: (): StreakSummary => {
      const dates = getMovementLogs().map((log) => new Date(log.completedAt));
      const now = new Date();
      return {
        currentStreak: computeCurrentStreak(dates, now),
        bestStreak: computeBestStreak(dates),
        weekStatuses: computeWeekStatuses(dates, now),
      };
    },
  });
}

/**
 * Record a completed routine. This also resets the sitting timer, so we
 * refresh both the streak and the settings afterwards.
 */
export function useLogMovement() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMovementLogInput): Promise<MovementLog> => {
      const log: MovementLog = {
        id: makeId(),
        routineId: input.routineId ?? null,
        completedAt: new Date().toISOString(),
      };
      setMovementLogs([...getMovementLogs(), log]);
      // Completing a routine counts as moving: reset the sitting timer.
      setSettings({ ...getSettings(), lastMovedAt: log.completedAt });
      return log;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.streak });
      void client.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}
