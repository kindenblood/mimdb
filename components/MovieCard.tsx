import { Movie } from "@/api/types";
import { useFavoritesStore } from "@/store/favoritesStore";
import { parseDuration } from "@/utils/utils";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

interface MovieCardProps {
  movie: Movie;
  onPress?: () => void;
}

export function MovieCard({ movie, onPress }: MovieCardProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(movie.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // default onpress (goes to movie detail)
  const handlePress =
    onPress ||
    (() => {
      router.push(`/movie/${movie.id}`);
    });

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row bg-white rounded-lg p-3 mb-3 border border-gray-200 active:bg-gray-50"
    >
      {movie.posterUrl ? (
        <Image
          source={{ uri: movie.posterUrl }}
          className="w-20 h-28 rounded"
          resizeMode="cover"
        />
      ) : (
        <View className="w-20 h-28 bg-gray-300 rounded items-center justify-center p-2">
          <Text
            className="text-xs text-gray-700 text-center font-semibold"
            numberOfLines={3}
          >
            {movie.title}
          </Text>
        </View>
      )}

      <View className="flex-1 ml-3 justify-center">
        <Text
          className="font-bold text-base text-gray-900 mb-1"
          numberOfLines={2}
        >
          {movie.title}
        </Text>

        {movie.summary && (
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
            {movie.summary}
          </Text>
        )}

        <View className="flex-row items-center">
          <View className="bg-gray-200 px-2 py-1 rounded">
            <Text className="text-xs text-gray-800 font-semibold">
              {movie.rating || "Unrated"}
            </Text>
          </View>

          {movie.duration && (
            <Text className="text-xs text-gray-700 ml-3">
              🕐 {parseDuration(movie.duration)}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }}
        className="justify-center items-center w-10"
      >
        <Text className="text-2xl">{isFavorite ? "❤️" : "🤍"}</Text>
      </Pressable>
    </Pressable>
  );
}
