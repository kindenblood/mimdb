import { useMovie } from "@/hooks/useMovie";
import { useFavoritesStore } from "@/store/favoritesStore";
import { parseDuration } from "@/utils/utils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: movie, isLoading, error } = useMovie(id!);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id!));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // loading screen
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading movie details...</Text>
      </View>
    );
  }

  // error screen
  if (error || !movie) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-6xl mb-4">😞</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Failed to Load Movie
        </Text>
        <Text className="text-center text-gray-600 mb-6">
          {error?.message || "Movie not found"}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: movie.title || "Movie Details",
          headerBackTitle: "Back",
        }}
      />

      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="px-4 py-6">
            {movie.posterUrl ? (
              <Image
                source={{ uri: movie.posterUrl }}
                className="w-full h-96 rounded-lg mb-6"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-96 bg-gray-300 rounded-lg mb-6 items-center justify-center">
                <Text className="text-4xl mb-2">🎬</Text>
                <Text className="text-gray-600 font-semibold">
                  No Poster Available
                </Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-3xl font-bold text-gray-900 flex-1 pr-2">
                {movie.title}
              </Text>
              <Pressable onPress={() => toggleFavorite(movie)} className="p-2">
                <Text className="text-3xl">{isFavorite ? "❤️" : "🤍"}</Text>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap mb-6">
              {/* Rating */}
              <View className="bg-gray-200 px-3 py-2 rounded-lg mr-2 mb-2">
                <Text className="text-sm font-semibold text-gray-800">
                  {movie.rating || "Unrated"}
                </Text>
              </View>

              {/* Duration */}
              {movie.duration && (
                <View className="bg-gray-200 px-3 py-2 rounded-lg mr-2 mb-2">
                  <Text className="text-sm font-semibold text-gray-800">
                    🕐 {parseDuration(movie.duration)}
                  </Text>
                </View>
              )}

              {/* Release Date */}
              {movie.datePublished && (
                <View className="bg-gray-200 px-3 py-2 rounded-lg mr-2 mb-2">
                  <Text className="text-sm font-semibold text-gray-800">
                    📅 {new Date(movie.datePublished).getFullYear()}
                  </Text>
                </View>
              )}

              {/* User Score */}
              {movie.ratingValue && (
                <View className="bg-yellow-400 px-3 py-2 rounded-lg mr-2 mb-2">
                  <Text className="text-sm font-semibold text-gray-900">
                    ⭐ {movie.ratingValue.toFixed(1)}/10
                  </Text>
                </View>
              )}
            </View>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Genres
                </Text>
                <View className="flex-row flex-wrap">
                  {movie.genres.map((genre, index) => (
                    <View
                      key={genre.id || index}
                      className="bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-sm font-semibold text-blue-800">
                        {genre.title}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Summary */}
            {movie.summary && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Summary
                </Text>
                <Text className="text-base text-gray-700 leading-6">
                  {movie.summary}
                </Text>
              </View>
            )}

            {/* Directors */}
            {movie.directors && movie.directors.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  {movie.directors.length === 1 ? "Director" : "Directors"}
                </Text>
                <Text className="text-base text-gray-700">
                  {movie.directors.join(", ")}
                </Text>
              </View>
            )}

            {/* Actors */}
            {movie.mainActors && movie.mainActors.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Cast
                </Text>
                <Text className="text-base text-gray-700">
                  {movie.mainActors.join(", ")}
                </Text>
              </View>
            )}

            {/* Writers */}
            {movie.writers && movie.writers.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  {movie.writers.length === 1 ? "Writer" : "Writers"}
                </Text>
                <Text className="text-base text-gray-700">
                  {movie.writers.join(", ")}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
