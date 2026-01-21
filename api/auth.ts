import { API_CONFIG, ENDPOINTS } from "@/constants/Api";
import { AuthTokenResponse } from "./types";

/**
 * Token Management
 *
 * This module handles fetching and caching the API bearer token.
 * The token is stored in memory (not AsyncStorage) since it's ephemeral.
 */

let cachedToken: string | null = null;

/**
 * Fetch a new authentication token from the API
 *
 * This is called automatically by getAuthToken() when needed.
 * Typically does not need to be called directly.
 *
 * @returns Promise<string> - The bearer token
 * @throws Error if token fetch fails
 */
async function fetchAuthToken(): Promise<string> {
  try {
    // handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.TOKEN}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    // check for a valid response
    if (!response.ok) {
      throw new Error(
        `Failed to fetch auth token: ${response.status} ${response.statusText}`,
      );
    }

    // parse response
    const data: AuthTokenResponse = await response.json();

    // validate token
    if (!data.token) {
      throw new Error("Auth token missing from response");
    }

    return data.token;
  } catch (error) {
    // timeout specific handling
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Auth token request timed out");
    }

    // throw other errors (network issues, parsing errors, etc.)
    throw error;
  }
}

/**
 * Get the current auth token, fetch a new one if needed
 *
 * This is the main function used by the API client.
 * It handles caching automatically.
 *
 * @returns Promise<string> - The bearer token
 *
 * @example
 * const token = await getAuthToken();
 * headers: { 'Authorization': `Bearer ${token}` }
 */
export async function getAuthToken(): Promise<string> {
  // grab from cache if available
  if (cachedToken) {
    return cachedToken;
  }

  // get a new token if needed, then cache it
  cachedToken = await fetchAuthToken();
  return cachedToken;
}

/**
 * Clear the cached token
 *
 * Useful for:
 * - Forcing a token refresh
 * - Handling 401 errors (token expired)
 * - Logout/reset scenarios
 *
 * @example
 * if (response.status === 401) {
 *   clearAuthToken();
 *   // Retry request with new token
 * }
 */
export function clearAuthToken(): void {
  cachedToken = null;
}
