import { type UseQuerySingleReturn, useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import type { UseBaseQueryOptions, UseQueryOptions } from '@tanstack/react-query';

export function useSuspenseQuery<Result>(
  query: PromiseLike<PostgrestSingleResponse<Result>>,
  config?: Omit<UseQueryOptions<PostgrestSingleResponse<Result>, PostgrestError>, 'queryKey' | 'queryFn'>,
): UseQuerySingleReturn<Result> {
  //
  // HACK
  //
  // original useSuspenseQuery uses useBaseQuery
  // https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseQuery.ts
  //
  // aaand, original useQuery also uses useBaseQuery
  // https://github.com/TanStack/query/blob/main/packages/react-query/src/useQuery.ts
  //
  // Therefore, we can just pass the same config that useSuspenseQuery passes to
  // useBaseQuery to supabase-cache-helpers' useQuery.
  //
  const suspense: Omit<UseBaseQueryOptions<PostgrestSingleResponse<Result>, PostgrestError>, 'queryKey' | 'queryFn'> = {
    suspense: true,
    placeholderData: undefined,
    throwOnError(_error, query) {
      return query.state.data === undefined;
    },
  };

  return useQuery(query, { ...config, ...suspense } as any);
}