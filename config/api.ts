import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import Constants from "expo-constants";
import { AppState, AppStateStatus } from "react-native";

// API Configuration for the frontend
export const API_CONFIG = {
  // Use the environment variable from .env file, with fallback to production URL
  baseUrl:
    Constants.expoConfig?.extra?.serverlessUrl ||
    process.env.SERVERLESS_FUNCTIONS_URL,
};

// Query Client configuration with universal offline/retry support
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long until data is considered stale (5 minutes)
      staleTime: 1000 * 60 * 5,
      // Cache time: how long to keep unused data in cache (10 minutes)
      gcTime: 1000 * 60 * 10,
      // Universal retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors) like authentication failures
        if (
          error?.message?.includes("No user ID") ||
          (error?.status >= 400 && error?.status < 500)
        ) {
          return false;
        }
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Universal refetch behavior
      refetchOnWindowFocus: false, // Disabled for mobile
      refetchOnMount: true,
      refetchOnReconnect: true, // Auto-refetch when coming back online
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 1; // Retry mutations once
      },
    },
  },
});

// Universal network management setup
export const setupUniversalQueryBehavior = () => {
  // App focus management for React Native
  const onAppStateChange = (status: AppStateStatus) => {
    focusManager.setFocused(status === "active");
  };

  AppState.addEventListener("change", onAppStateChange);

  // Network status management (will be set up when NetInfo is available)
  // This is a placeholder - actual implementation depends on your network detection library
  onlineManager.setEventListener((setOnline) => {
    // You can integrate with @react-native-netinfo or similar
    // For now, we rely on the default browser online/offline events
    return () => {};
  });
};
