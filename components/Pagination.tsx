import { useFilterStore } from "@/store/filterStore";
import { Pressable, Text, View } from "react-native";

/**
 * Pagination Component
 *
 * Displays pagination controls with Previous/Next buttons and page info.
 *
 * @param totalPages - Total number of pages available
 *
 * @example
 * <Pagination totalPages={data.totalPages} />
 */

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const { currentPage, setCurrentPage } = useFilterStore();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // dont render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <View className="bg-white border-t border-gray-200 px-4 py-4">
      {/* Page Info */}
      <View className="mb-3">
        <Text className="text-center text-sm text-gray-600">
          Page <Text className="font-semibold">{currentPage}</Text> of{" "}
          <Text className="font-semibold">{totalPages}</Text>
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between items-center px-6">
        <Pressable
          onPress={handlePrevious}
          disabled={isFirstPage}
          className={`flex-1 mr-2 px-4 py-3 rounded-lg ${
            isFirstPage ? "bg-gray-200" : "bg-blue-500 active:bg-blue-600"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              isFirstPage ? "text-gray-400" : "text-white"
            }`}
          >
            ← Previous
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={isLastPage}
          className={`flex-1 ml-2 px-4 py-3 rounded-lg ${
            isLastPage ? "bg-gray-200" : "bg-blue-500 active:bg-blue-600"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              isLastPage ? "text-gray-400" : "text-white"
            }`}
          >
            Next →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
