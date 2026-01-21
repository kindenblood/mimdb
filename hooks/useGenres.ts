import { getGenres } from "@/api/movies";
import { QUERY_CONFIG } from "@/constants/Api";
import { useQuery } from "@tanstack/react-query";

/**
 * useGenres Hook
 *
 * ReactQuery hook for fetching all movie genres.
 *
 * @returns React Query result with genre data and states
 *
 * @example
 * function Filter() {
 *   const { data, isLoading } = useGenres();
 *
 *   if (isLoading) return <Loading />;
 *
 *   return data.data.map(genre => (
 *     <GenreButton key={genre.id} genre={genre} />
 *   ));
 * }
 */
export function useGenres() {
  return useQuery({
    queryKey: ["genres"],

    // high limit to get all genres in one request
    queryFn: () => getGenres({ page: 1, limit: 100 }),

    // cache genres for a long time (30min)
    // assume genres don't change often, reduce calls
    staleTime: QUERY_CONFIG.STALE_TIME * 3,
    retry: 1, // reduce retries for a non-user triggered call
    gcTime: QUERY_CONFIG.CACHE_TIME * 2, // 40min
  });
}
