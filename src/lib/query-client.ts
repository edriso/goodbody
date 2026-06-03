import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client. Here it acts as a small reactive cache over
 * localStorage: query functions read local data, mutations write it and then
 * invalidate, so the UI updates the same way it did against the API.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

/** One place for all query keys, so they never drift out of sync. */
export const queryKeys = {
  content: ['content'] as const,
  routines: ['routines'] as const,
  programs: ['programs'] as const,
  settings: ['settings'] as const,
  streak: ['streak'] as const,
  programProgress: ['program-progress'] as const,
  ergonomics: ['ergonomics'] as const,
};
