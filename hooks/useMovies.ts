import { getMovies } from "@/api/movies";
import { API_CONFIG, QUERY_CONFIG } from "@/constants/Api";
import { useFilterStore } from "@/store/filterStore";
import { useQuery } from "@tanstack/react-query";

/**
 * useMovies Hook
 *
 * React Query hook for fetching movies with search, filter, and pagination.
 * Automatically refetches when filters change.
 *
 * @returns React Query result with movie data and states
 *
 * @example
 * function MovieList() {
 *   const { data, isLoading, error } = useMovies();
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error />;
 *
 *   return data.data.map(movie => <MovieCard movie={movie} />);
 * }
 */
export function useMovies() {
  const { searchTerm, selectedGenre, currentPage } = useFilterStore();

  return useQuery({
    queryKey: [
      "movies",
      {
        search: searchTerm || undefined,
        genre: selectedGenre || undefined,
        page: currentPage,
      },
    ],
    queryFn: () =>
      getMovies({
        search: searchTerm || undefined,
        genre: selectedGenre || undefined,
        page: currentPage,
        limit: API_CONFIG.DEFAULT_LIMIT,
      }),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,

    // keep previous data while getting new data to prevent transitional loading state
    placeholderData: (previousData) => previousData,
  });
}
