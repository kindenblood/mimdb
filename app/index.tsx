import { Movie } from "@/api/types";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Filter } from "@/components/Filter";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { useMovies } from "@/hooks/useMovies";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useFilterStore } from "@/store/filterStore";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  const { data, isLoading, error, refetch, isFetching } = useMovies();

  const favorites = useFavoritesStore((state) => state.favorites);
  const favoritesLoading = useFavoritesStore((state) => state.isLoading);

  const { selectedGenre } = useFilterStore();

  const isFavoritesView = selectedGenre === "favorites";
  const displayedMovies = isFavoritesView ? favorites : data?.data || [];
  const isLoadingData = isFavoritesView ? favoritesLoading : isLoading;

  /**
   * Calculate approximate total count
   *
   * NOTE: This is an approximation since the API doesn't return a total count.
   * I calculate totalPages × itemsPerPage, which will be slightly high if the last page is partial
   * (e.g., 153 results shows as "~175" when it's really 7 pages × 25).
   * In the a prod scenario I would like call the API with an overtly high `limit` value,
   * get all movies possible, and then build a custom pagination system client-side to have exact counts.
   * But for this demo app I felt this was ok. (or add a totalCount field to the API response itself)
   *
   */
  const approximateTotalCount = data?.totalPages
    ? data.totalPages * 25 // 25 = items per page from API
    : displayedMovies.length;

  return (
    <>
      <Stack.Screen
        options={{
          title: "MiMDB",
        }}
      />

      <View className="flex-1 bg-gray-50">
        <SearchBar />
        <Filter />

        <View className="flex-1">
          {isLoadingData && <LoadingSkeleton />}

          {error && !isLoadingData && !isFavoritesView && (
            <ErrorState error={error.message} onRetry={refetch} />
          )}

          {!isLoadingData && displayedMovies.length === 0 && (
            <EmptyState
              message={
                isFavoritesView
                  ? "No favorites yet. Tap the heart icon on movies to add them to your favorites!"
                  : "No movies found. Try a different search or filter."
              }
            />
          )}

          {!isLoadingData && displayedMovies.length > 0 && (
            <>
              {isFetching && !isLoading && !isFavoritesView && (
                <View className="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <Text className="text-sm text-blue-700 text-center">
                    Updating...
                  </Text>
                </View>
              )}

              {/* Results Counter */}
              <View className="px-4 py-3 bg-white border-b border-gray-200">
                <Text className="text-sm text-gray-600">
                  {isFavoritesView
                    ? // exact count for favorites (local data)
                      `${displayedMovies.length} ${displayedMovies.length === 1 ? "favorite" : "favorites"}`
                    : // approximate count for API results
                      `~${approximateTotalCount} total ${approximateTotalCount === 1 ? "result" : "results"}`}
                </Text>
              </View>

              <FlashList
                data={displayedMovies}
                renderItem={({ item }: { item: Movie }) => (
                  <MovieCard movie={item} />
                )}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingTop: 16,
                  paddingBottom: 16,
                }}
                keyExtractor={(item) => item.id}
              />

              {!isFavoritesView && data && data.totalPages > 1 && (
                <Pagination totalPages={data.totalPages} />
              )}
            </>
          )}
        </View>
      </View>
    </>
  );
}
