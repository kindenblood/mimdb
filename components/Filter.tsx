import { useGenres } from "@/hooks/useGenres";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useFilterStore } from "@/store/filterStore";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export function Filter() {
  const { data, isLoading, error } = useGenres();
  const { selectedGenre, setSelectedGenre, searchTerm } = useFilterStore();
  const favorites = useFavoritesStore((state) => state.favorites);

  if (isLoading) {
    return (
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  if (error || !data) {
    return null;
  }

  const hasActiveSearch = searchTerm.trim().length > 0;
  const isFavoritesActive = selectedGenre === "favorites";

  return (
    <View className="bg-white border-b border-gray-200 py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex-row"
      >
        <Pressable
          onPress={() =>
            setSelectedGenre(isFavoritesActive ? null : "favorites")
          }
          className={`px-4 py-2 rounded-full mr-2 ${
            isFavoritesActive ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              isFavoritesActive ? "text-white" : "text-gray-700"
            }`}
          >
            ❤️ Favorites{hasActiveSearch ? "" : ` (${favorites.length})`}
          </Text>
        </Pressable>

        <View className="w-px bg-gray-300 mx-2 self-stretch" />

        <Pressable
          onPress={() => setSelectedGenre(null)}
          className={`px-4 py-2 rounded-full mr-2 ${
            selectedGenre === null ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              selectedGenre === null ? "text-white" : "text-gray-700"
            }`}
          >
            All
          </Text>
        </Pressable>

        {data.data.map((genre) => {
          const isActive = selectedGenre === genre.title;
          const movieCount = genre.movies?.length || 0;

          return (
            <Pressable
              key={genre.id}
              onPress={() => setSelectedGenre(genre.title)}
              className={`px-4 py-2 rounded-full mr-2 ${
                isActive ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              >
                {genre.title}
                {hasActiveSearch ? "" : ` (${movieCount})`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
