import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { getProgramProgress, setProgramProgress } from '@/lib/storage';

/** The set of program session ids the user has completed. */
export function useProgramProgress() {
  return useQuery({
    queryKey: queryKeys.programProgress,
    queryFn: (): Set<string> => new Set(getProgramProgress()),
  });
}

/** Tick or untick a program session. */
export function useToggleSession() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: { programSessionId: string; done: boolean }): Promise<void> => {
      const current = new Set(getProgramProgress());
      if (input.done) {
        current.add(input.programSessionId);
      } else {
        current.delete(input.programSessionId);
      }
      setProgramProgress([...current]);
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.programProgress });
    },
  });
}
