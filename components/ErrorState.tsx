import { Pressable, Text, View } from "react-native";

/**
 * ErrorState Component
 *
 * Displays when an error occurs (API failure, network error, etc.)
 *
 * @param error - Error message to display
 * @param onRetry - Callback function to retry the failed operation
 *
 * @example
 * {error && (
 *   <ErrorState
 *     error="Failed to load movies"
 *     onRetry={() => refetch()}
 *   />
 * )}
 */

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Text className="text-6xl mb-4">⚠️</Text>

      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        Something Went Wrong
      </Text>

      <Text className="text-sm text-gray-600 text-center mb-6">
        {error || "We couldn't load the content. Please try again."}
      </Text>

      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}
