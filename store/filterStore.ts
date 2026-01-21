import { create } from "zustand";

/**
 * Filter Store
 *
 * Manages client state for movie search and filtering.
 */

interface FilterState {
  searchTerm: string;
  selectedGenre: string | null; // null = all genres
  currentPage: number;
  setSearchTerm: (term: string) => void;
  setSelectedGenre: (genre: string | null) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

/**
 * Default values
 */
const INITIAL_STATE = {
  searchTerm: "",
  selectedGenre: null,
  currentPage: 1,
};

/**
 * Filter Store Hook
 *
 * Usage in components:
 * const { searchTerm, setSearchTerm } = useFilterStore();
 */
export const useFilterStore = create<FilterState>((set) => ({
  ...INITIAL_STATE,

  /**
   * Update search term
   */
  setSearchTerm: (term) =>
    set({
      searchTerm: term,
      currentPage: 1, // reset page on new search
    }),

  /**
   * Update selected genre
   *
   * Pass null to clear genre filter (show all genres)
   */
  setSelectedGenre: (genre) =>
    set({
      selectedGenre: genre,
      currentPage: 1, // reset page on filter change
    }),

  /**
   * Update current page
   */
  setCurrentPage: (page) =>
    set({
      currentPage: page,
    }),

  /**
   * Reset all filters to initial state (clear all filters)
   */
  resetFilters: () => set(INITIAL_STATE),
}));
