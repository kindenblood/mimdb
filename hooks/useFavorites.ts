import { Movie } from "@/api/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

/**
 * Storage key for favorites in AsyncStorage
 */
const FAVORITES_KEY = "@movie_favorites";

/**
 * useFavorites Hook
 *
 * Manages a persistent list of favorite movies using AsyncStorage.
 *
 * @returns Object with favorites array and management functions
 *
 * @example
 * function MovieCard({ movie }) {
 *   const { favorites, toggleFavorite, isFavorite } = useFavorites();
 *
 *   return (
 *     <button onClick={() => toggleFavorite(movie)}>
 *       {isFavorite(movie.id) ? '❤️' : '🤍'}
 *     </button>
 *   );
 * }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  /**
   * Load favorites from AsyncStorage
   */
  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        // validate the array
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        } else {
          // data is corrupted, reset to empty
          console.warn("Favorites data corrupted, resetting to empty");
          setFavorites([]);
          await AsyncStorage.removeItem(FAVORITES_KEY);
        }
      }
    } catch (error) {
      // catch parsing or storage error
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save favorites to AsyncStorage
   *
   * Called after every add/remove operation.
   * Runs asynchronously so UI doesn't wait for storage.
   */
  const saveFavorites = async (newFavorites: Movie[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      // storage maxed or permissions issue
      console.error("Failed to save favorites:", error);

      // prod would likely show user feedback
      // Alert.alert('Error', 'Failed to save favorites');
    }
  };

  /**
   * Add a movie to favorites
   *
   * If movie is already favorited, this does nothing.
   */
  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((current) => {
      const alreadyExists = current.some((fav) => fav.id === movie.id);

      if (alreadyExists) {
        return current;
      }

      // add to the beginning of array (most recent first)
      const updated = [movie, ...current];
      saveFavorites(updated);

      return updated;
    });
  }, []);

  /**
   * Remove a movie from favorites
   */
  const removeFavorite = useCallback((movieId: string) => {
    setFavorites((current) => {
      const updated = current.filter((fav) => fav.id !== movieId);
      saveFavorites(updated);

      return updated;
    });
  }, []);

  /**
   * Toggle favorite status (add if not favorited, remove if favorited)
   */
  const toggleFavorite = useCallback(
    async (movie: Movie) => {
      console.log("toggleFavorite called for:", movie.id);

      const isCurrentlyFavorite = favorites.some((fav) => fav.id === movie.id);
      console.log("Is currently favorite?", isCurrentlyFavorite);

      let updatedFavorites: Movie[];

      if (isCurrentlyFavorite) {
        // remove the movie if favorited
        updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
      } else {
        // add the movie if not favorited
        updatedFavorites = [movie, ...favorites];
      }

      setFavorites(updatedFavorites);

      // persist to async storage
      try {
        await AsyncStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(updatedFavorites),
        );
      } catch (error) {
        console.error("Failed to save favorites:", error);

        // prod would likely show user feedback
        // Alert.alert('Error', 'Failed to save favorites');
      }
    },
    [favorites],
  );

  /**
   * Check if a movie is in favorites
   *
   * @param movieId - Movie ID to check
   * @returns true if movie is favorited, false otherwise
   */
  const isFavorite = useCallback(
    (movieId: string): boolean => {
      return favorites.some((fav) => fav.id === movieId);
    },
    [favorites],
  );

  /**
   * Clear all favorites
   * Currently unused but would exist in a production scenario
   *
   */
  const clearFavorites = useCallback(async () => {
    setFavorites([]);
    await AsyncStorage.removeItem(FAVORITES_KEY);
  }, []);

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
