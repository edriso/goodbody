import type { AppContent, Program, Routine } from '@good-bodies/types';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { appContent, programs, routines } from '@/data/content';

/** The tagline, safety note, and rotating health facts. */
export function useContent() {
  return useQuery({
    queryKey: queryKeys.content,
    queryFn: (): AppContent => appContent,
    staleTime: Infinity,
  });
}

/** Every guided routine with its steps. */
export function useRoutines() {
  return useQuery({
    queryKey: queryKeys.routines,
    queryFn: (): Routine[] => routines,
    staleTime: Infinity,
  });
}

/** Every program with its weeks and sessions. */
export function usePrograms() {
  return useQuery({
    queryKey: queryKeys.programs,
    queryFn: (): Program[] => programs,
    staleTime: Infinity,
  });
}
