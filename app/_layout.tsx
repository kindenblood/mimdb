import { QUERY_CONFIG } from "@/constants/Api";
import { useFavoritesStore } from "@/store/favoritesStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  // create QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // default config for all queries
            retry: QUERY_CONFIG.RETRY,
            staleTime: QUERY_CONFIG.STALE_TIME, // 10 minutes
          },
        },
      }),
  );

  useEffect(() => {
    loadFavorites();
  }, []);

  // note: leaving this here as a template for wrapping future tabbed pages in the QueryClient
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryClientProvider>
  );
}
