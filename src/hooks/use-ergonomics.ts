import type { ErgonomicsGroup, ErgonomicsState } from '@good-bodies/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { ergonomicsCatalogue, ergonomicsGroupOrder } from '@/data/content';
import { getErgonomicsChecks, setErgonomicsChecks } from '@/lib/storage';

const ergonomicsKeys = new Set(ergonomicsCatalogue.map((item) => item.key));

/** Joins the fixed catalogue with the user's answers and computes the score. */
function buildState(checkedByKey: Record<string, boolean>): ErgonomicsState {
  const groups: ErgonomicsGroup[] = ergonomicsGroupOrder.map((group) => ({
    group,
    items: ergonomicsCatalogue
      .filter((item) => item.group === group)
      .map((item) => ({
        key: item.key,
        group: item.group,
        text: item.text,
        checked: checkedByKey[item.key] ?? false,
      })),
  }));

  const totalCount = ergonomicsCatalogue.length;
  const checkedCount = ergonomicsCatalogue.filter((item) => checkedByKey[item.key] === true).length;
  const score = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  return { groups, checkedCount, totalCount, score };
}

/** The ergonomics checklist with the user's answers and the setup score. */
export function useErgonomics() {
  return useQuery({
    queryKey: queryKeys.ergonomics,
    queryFn: (): ErgonomicsState => buildState(getErgonomicsChecks()),
  });
}

/** Tick or untick one checklist item. */
export function useSetErgonomicsItem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: { key: string; checked: boolean }): Promise<ErgonomicsState> => {
      if (!ergonomicsKeys.has(input.key)) {
        throw new Error(`Unknown ergonomics item "${input.key}"`);
      }
      const checks = { ...getErgonomicsChecks(), [input.key]: input.checked };
      setErgonomicsChecks(checks);
      return buildState(checks);
    },
    onSuccess: (data) => client.setQueryData(queryKeys.ergonomics, data),
  });
}
