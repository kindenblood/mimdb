import { useFilterStore } from "@/store/filterStore";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

/**
 * SearchBar Component
 *
 * Provides a search input with a search button.
 * Connects to the filter store to trigger movie searches.
 *
 * @example
 * <SearchBar />
 */

export function SearchBar() {
  const { searchTerm, setSearchTerm } = useFilterStore();

  const [inputValue, setInputValue] = useState(searchTerm);

  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue("");
    setSearchTerm("");
  };

  return (
    <View className="px-4 py-3 bg-white border-b border-gray-200">
      <View className="flex-row items-center gap-2">
        {/* Search Input */}
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSearch}
            placeholder="Search movies..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            className="flex-1 text-gray-900"
          />

          {/* Clear Button (only show if input has text) */}
          {inputValue.length > 0 && (
            <Pressable onPress={handleClear} className="ml-2">
              <Text className="text-gray-400">✕</Text>
            </Pressable>
          )}
        </View>

        {/* Search Button */}
        <Pressable
          onPress={handleSearch}
          className="bg-blue-500 px-4 py-2 rounded-lg active:bg-blue-600"
        >
          <Text className="text-white font-semibold">Search</Text>
        </Pressable>
      </View>

      {/* Active Search */}
      {searchTerm && (
        <View className="mt-2 flex-row items-center">
          <Text className="text-sm text-gray-600">
            Searching for: <Text className="font-semibold">{searchTerm}</Text>
          </Text>
          <Pressable onPress={() => setSearchTerm("")} className="ml-2">
            <Text className="text-sm text-blue-500">Clear</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
