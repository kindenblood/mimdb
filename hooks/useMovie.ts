import { getMovie } from "@/api/movies";
import { Movie } from "@/api/types";
import { QUERY_CONFIG } from "@/constants/Api";
import { useQuery } from "@tanstack/react-query";

/**
 * useMovie Hook
 *
 * Fetches a single movie by ID.
 *
 * @param id - Movie ID to fetch
 * @returns React Query result with movie data
 *
 * @example
 * const { data: movie, isLoading, error } = useMovie('abc123');
 */
export function useMovie(id: string) {
  return useQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id),
    enabled: !!id, // only run if id exists
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.CACHE_TIME,
  });
}
