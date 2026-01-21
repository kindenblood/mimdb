import { ENDPOINTS } from "@/constants/Api";
import { apiClient } from "./client";
import {
  DataWithPaginationResponse,
  Genre,
  Movie,
  MovieQueryParams,
} from "./types";

/**
 * Get a paginated list of movies
 *
 * Supports searching by title and filtering by genre.
 *
 * @param params - Query parameters for filtering, searching, and pagination
 * @returns Promise with movie data and pagination info
 *
 * @example
 * // Get first page
 * const movies = await getMovies({ page: 1, limit: 25 });
 *
 * @example
 * // Search for movies with "action" in the title
 * const results = await getMovies({ search: 'action', page: 1 });
 *
 * @example
 * // Filter by Action genre (exact match)
 * const sciFi = await getMovies({ genre: 'Action', page: 1 });
 */
export async function getMovies(
  params?: MovieQueryParams,
): Promise<DataWithPaginationResponse<Movie>> {
  return apiClient.get<DataWithPaginationResponse<Movie>>(
    ENDPOINTS.MOVIES.LIST,
    params,
  );
}

/**
 * Get a single movie by ID
 *
 * @param id - Movie ID
 * @returns Promise with full movie details
 *
 * @example
 * const movie = await getMovie('7GQMaTpw7B0MInjOHis5yu');
 */
export async function getMovie(id: string): Promise<Movie> {
  return apiClient.get<Movie>(ENDPOINTS.MOVIES.DETAIL(id));
}

/**
 * Get all movie genres
 *
 * Returns a list of genres with their associated movies.
 *
 * @param params - Optional pagination parameters
 * @returns Promise with genre data and pagination info
 *
 * @example
 * const genres = await getGenres();
 * genres.data.forEach(genre => {
 *   console.log(`${genre.title}: ${genre.movies.length} movies`);
 * });
 */
export async function getGenres(params?: {
  page?: number;
  limit?: number;
}): Promise<DataWithPaginationResponse<Genre>> {
  return apiClient.get<DataWithPaginationResponse<Genre>>(
    ENDPOINTS.GENRES.MOVIES,
    params,
  );
}
