import { API_CONFIG } from "@/constants/Api";
import { clearAuthToken, getAuthToken } from "./auth";
import { ApiError } from "./types";

/**
 * API Client - Fetch Wrapper
 *
 * A wrapper around the native Fetch API that handles:
 * - Automatic auth token injection
 * - Timeout handling
 * - Error parsing
 * - Response parsing
 * - Retry logic for 401 errors
 */

/**
 * Custom error class for API errors
 *
 * Extends Error to include status code and response details
 */
class ApiRequestError extends Error implements ApiError {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Parse error response from API
 *
 * @param response - Fetch Response object
 * @returns Promise<string> - Parsed error message
 */
async function parseErrorResponse(response: Response): Promise<string> {
  try {
    // try to parse error response
    const errorData = await response.json();
    return errorData.message || errorData.error || response.statusText;
  } catch {
    // if parsing fails, default to status text
    return response.statusText || "Unknown error occurred";
  }
}

/**
 * Base fetch wrapper with common logic
 *
 * This handles:
 * - Timeout
 * - Auth token injection
 * - Error handling
 * - Response parsing
 *
 * @param endpoint - API endpoint (e.g., '/movies')
 * @param options - Fetch options
 * @param retry - Internal flag for retry logic
 */
async function baseFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  try {
    // get auth token
    const token = await getAuthToken();

    // init timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    // build out URL
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // request with auth header
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // handle 401 (expired or invalid token - retry once)
    if (response.status === 401 && retry) {
      clearAuthToken();
      return baseFetch<T>(endpoint, options, false);
    }

    // validate response
    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new ApiRequestError(errorMessage, response.status, {
        endpoint,
        method: options.method || "GET",
      });
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    // handle timeout/abort
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiRequestError("Request timed out", 408, { endpoint });
    }

    // handle network errors
    if (error instanceof TypeError) {
      throw new ApiRequestError(
        "Network error - please check your connection",
        0,
        { endpoint, originalError: error.message },
      );
    }

    // throw generic error as is
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // handle unknown errors
    throw new ApiRequestError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500,
      { endpoint, originalError: error },
    );
  }
}

/* API Client Methods (CRUD operations) */

/**
 * GET
 *
 * @param endpoint - API endpoint (e.g., '/movies')
 * @param params - Query parameters (optional)
 *
 * @example
 * const movies = await apiClient.get('/movies', { page: 1, limit: 25 });
 */
async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  // build out the query string from search params
  let url = endpoint;
  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&");

    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return baseFetch<T>(url, { method: "GET" });
}

/**
 * API Client exports
 *
 * Note: the actual wrapper that I built normally includes all possible fetch methods.
 * Since this project only requires GET requests I deleted the others, but left the general structure in place.
 * I felt this would better demonstrate my typical approach to building API clients, and show how the wrapper
 * could be scaled and incorporated in a production scenario.
 */
export const apiClient = {
  get,
};
