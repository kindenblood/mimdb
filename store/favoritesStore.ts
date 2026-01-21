import { Movie } from "@/api/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const FAVORITES_KEY = "@movie_favorites";

interface FavoritesState {
  favorites: Movie[];
  isLoading: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (movie: Movie) => Promise<void>;
  isFavorite: (movieId: string) => boolean;
  clearFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: true,

  // load favorites from async storage
  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ favorites: parsed, isLoading: false });
          return;
        }
      }
      set({ favorites: [], isLoading: false });
    } catch (error) {
      console.error("Failed to load favorites:", error);
      set({ favorites: [], isLoading: false });
    }
  },

  toggleFavorite: async (movie: Movie) => {
    const { favorites } = get();
    const isCurrentlyFavorite = favorites.some((fav) => fav.id === movie.id);

    const updatedFavorites = isCurrentlyFavorite
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [movie, ...favorites];

    // update state immediately
    set({ favorites: updatedFavorites });

    // persist to async storage
    try {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites),
      );
      console.log("✅ Favorites updated in AsyncStorage");
    } catch (error) {
      console.error("Failed to save favorites:", error);
      // revert state on failure
      set({ favorites });
    }
  },

  isFavorite: (movieId: string) => {
    return get().favorites.some((fav) => fav.id === movieId);
  },

  clearFavorites: async () => {
    set({ favorites: [] });
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error("Failed to clear favorites:", error);
    }
  },
}));
