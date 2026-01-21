import { View } from "react-native";

/**
 * LoadingSkeleton Component
 *
 * Displays placeholder "skeleton" cards while content is loading.
 *
 * @example
 * {isLoading && <LoadingSkeleton />}
 */
export function LoadingSkeleton() {
  // show 5 (should fill most screens)
  const skeletonCount = 5;

  return (
    <View className="px-4 py-2">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

/**
 * Individual Skeleton Card
 *
 * Mimics the layout of a MovieCard component.
 */
function SkeletonCard() {
  return (
    <View className="flex-row bg-white rounded-lg p-3 mb-3 border border-gray-200">
      <View className="w-20 h-28 bg-gray-300 rounded" />

      <View className="flex-1 ml-3 justify-center">
        <View className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
        <View className="h-3 bg-gray-200 rounded w-full mb-1" />
        <View className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
        <View className="h-3 bg-gray-300 rounded w-1/4" />
      </View>

      <View className="w-8 h-8 bg-gray-300 rounded-full" />
    </View>
  );
}
