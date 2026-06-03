import type { UpdateSettingsInput, UserSettings } from '@good-bodies/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { getSettings, setSettings } from '@/lib/storage';

/** The current settings (reminder interval, theme, accent, lastMovedAt). */
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: (): UserSettings => getSettings(),
  });
}

/** Update the reminder interval, theme, or accent. */
export function useUpdateSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateSettingsInput): Promise<UserSettings> => {
      return setSettings({ ...getSettings(), ...input });
    },
    onSuccess: (data) => client.setQueryData(queryKeys.settings, data),
  });
}

/** Reset the sitting timer ("I moved"). */
export function useMarkMoved() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<UserSettings> => {
      return setSettings({ ...getSettings(), lastMovedAt: new Date().toISOString() });
    },
    onSuccess: (data) => client.setQueryData(queryKeys.settings, data),
  });
}
