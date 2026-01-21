export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL,
  TIMEOUT: 10000,
  DEFAULT_LIMIT: 25,
  DEFAULT_PAGE: 1,
} as const;

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  AUTH: {
    TOKEN: "/auth/token",
  },
  MOVIES: {
    LIST: "/movies",
    DETAIL: (id: string) => `/movies/${id}`,
  },
  GENRES: {
    MOVIES: "/genres/movies",
  },
} as const;

/**
 * ReactQuery Configuration
 */
export const QUERY_CONFIG = {
  STALE_TIME: 10 * 60 * 1000, // note: chose 10 mins as movie data doesn't change often, balances freshness with performance
  CACHE_TIME: 20 * 60 * 1000, // note: chose 20 mins to keep data cached double the stale time for better UX
  RETRY: 2,
  RETRY_DELAY: 1000,
} as const;
