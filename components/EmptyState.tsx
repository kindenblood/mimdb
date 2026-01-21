import { Text, View } from "react-native";

/**
 * EmptyState Component
 *
 * Displays when no movies match the current search/filter criteria.
 *
 * @param message - Optional custom message (defaults to generic message)
 *
 * @example
 * {data?.data.length === 0 && <EmptyState />}
 */

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Text className="text-6xl mb-4">🎬</Text>

      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        No Movies Found
      </Text>

      <Text className="text-sm text-gray-600 text-center">
        {message ||
          "Try adjusting your search or filters to find what you're looking for."}
      </Text>
    </View>
  );
}
