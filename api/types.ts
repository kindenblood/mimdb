export interface DataWithPaginationResponse<T> {
  data: T[];
  totalPages: number;
}
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  summary: string;
  duration: string;
  directors: string[];
  mainActors: string[];
  // without the movies array to avoid circular refs
  genres: Omit<Genre, "movies">[] | null;
  datePublished: string;
  // mpaa rating
  rating: string;
  // user score
  ratingValue: number;
  bestRating: number;
  worstRating: number;
  writers: string[];
}

export type MovieSummary = Pick<Movie, "id" | "title" | "posterUrl" | "rating">;

export interface Genre {
  id: string;
  title: string | null;
  movies: Partial<Movie>[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface MovieQueryParams extends PaginationOptions {
  search?: string;
  genre?: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}
