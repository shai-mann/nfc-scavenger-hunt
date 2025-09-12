import { apiClient } from "@/lib/api-client";
import { router } from "expo-router";
import { useLayoutEffect } from "react";

export default function Index() {
  useLayoutEffect(() => {
    // If the user is registered, redirect to the home screen, otherwise redirect to the registration screen
    router.replace(apiClient.getUserId() ? "/(tabs)" : "/registration");
  }, []);

  return null;
}
